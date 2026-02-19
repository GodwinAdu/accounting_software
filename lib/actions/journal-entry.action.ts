"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import JournalEntry from "../models/journal-entry.model";
import Account from "../models/account.model";
import GeneralLedger from "../models/general-ledger.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createJournalEntry(data: any, user: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastEntry = await JournalEntry.findOne({ organizationId: user.organizationId })
      .sort({ entryNumber: -1 })
      .select("entryNumber");

    let nextNumber = 1;
    if (lastEntry?.entryNumber) {
      const lastNum = parseInt(lastEntry.entryNumber.split("-")[1]);
      nextNumber = lastNum + 1;
    }
    const entryNumber = `JE-${String(nextNumber).padStart(6, "0")}`;

    // Calculate totals
    const totalDebit = data.lineItems.reduce((sum: number, item: any) => sum + (item.debit || 0), 0);
    const totalCredit = data.lineItems.reduce((sum: number, item: any) => sum + (item.credit || 0), 0);

    const journalEntry = await JournalEntry.create({
      ...data,
      organizationId: user.organizationId,
      entryNumber,
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "journal_entry",
      resourceId: String(journalEntry._id),
      details: { after: journalEntry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(journalEntry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _postJournalEntry(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const journalEntry = await JournalEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
      status: "draft",
    });

    if (!journalEntry) {
      return { error: "Journal entry not found or already posted" };
    }

    if (!journalEntry.isBalanced) {
      return { error: "Journal entry must be balanced before posting" };
    }

    // Start transaction
    const session = await connectToDB().then((conn) => conn.startSession());
    session.startTransaction();

    try {
      // Update journal entry status
      journalEntry.status = "posted";
      journalEntry.postedDate = new Date();
      journalEntry.postedBy = user._id;
      await journalEntry.save({ session });

      // Get fiscal year and period
      const entryDate = new Date(journalEntry.entryDate);
      const fiscalYear = entryDate.getFullYear();
      const fiscalPeriod = entryDate.getMonth() + 1;

      // Post to general ledger and update account balances
      for (const lineItem of journalEntry.lineItems) {
        // Create general ledger entry
        await GeneralLedger.create(
          [
            {
              organizationId: user.organizationId,
              accountId: lineItem.accountId,
              journalEntryId: journalEntry._id,
              transactionDate: journalEntry.entryDate,
              description: lineItem.description || journalEntry.description,
              debit: lineItem.debit,
              credit: lineItem.credit,
              referenceType: journalEntry.referenceType,
              referenceId: journalEntry.referenceId,
              referenceNumber: journalEntry.referenceNumber,
              fiscalYear,
              fiscalPeriod,
            },
          ],
          { session }
        );

        // Update account balance
        const account = await Account.findById(lineItem.accountId).session(session);
        if (account) {
          account.debitBalance += lineItem.debit;
          account.creditBalance += lineItem.credit;

          // Calculate current balance based on account type
          if (["asset", "expense"].includes(account.accountType)) {
            account.currentBalance = account.debitBalance - account.creditBalance;
          } else {
            account.currentBalance = account.creditBalance - account.debitBalance;
          }

          await account.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      revalidatePath("/");
      return { success: true, data: JSON.parse(JSON.stringify(journalEntry)) };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getJournalEntries(user: any) {
  try {
    await connectToDB();

    const entries = await JournalEntry.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("lineItems.accountId", "accountName accountCode")
      .populate("postedBy", "fullName")
      .sort({ entryDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(entries)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getJournalEntryById(user: any, id: string) {
  try {
    await connectToDB();

    const entry = await JournalEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("lineItems.accountId", "accountName accountCode accountType")
      .populate("postedBy", "fullName")
      .populate("voidedBy", "fullName");

    if (!entry) {
      return { error: "Journal entry not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(entry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateJournalEntry(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldEntry = await JournalEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
      status: "draft",
    });

    if (!oldEntry) {
      return { error: "Journal entry not found or already posted" };
    }

    // Recalculate totals
    const totalDebit = data.lineItems.reduce((sum: number, item: any) => sum + (item.debit || 0), 0);
    const totalCredit = data.lineItems.reduce((sum: number, item: any) => sum + (item.credit || 0), 0);

    Object.assign(oldEntry, {
      ...data,
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      modifiedBy: user._id,
      mod_flag: oldEntry.mod_flag + 1,
    });

    await oldEntry.save();

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "journal_entry",
      resourceId: String(id),
      details: { before: oldEntry, after: oldEntry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(oldEntry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _voidJournalEntry(user: any, id: string, reason: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const journalEntry = await JournalEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
      status: "posted",
    });

    if (!journalEntry) {
      return { error: "Journal entry not found or not posted" };
    }

    const session = await connectToDB().then((conn) => conn.startSession());
    session.startTransaction();

    try {
      // Update journal entry status
      journalEntry.status = "voided";
      journalEntry.voidedDate = new Date();
      journalEntry.voidedBy = user._id;
      journalEntry.voidReason = reason;
      await journalEntry.save({ session });

      // Reverse account balances
      for (const lineItem of journalEntry.lineItems) {
        const account = await Account.findById(lineItem.accountId).session(session);
        if (account) {
          account.debitBalance -= lineItem.debit;
          account.creditBalance -= lineItem.credit;

          if (["asset", "expense"].includes(account.accountType)) {
            account.currentBalance = account.debitBalance - account.creditBalance;
          } else {
            account.currentBalance = account.creditBalance - account.debitBalance;
          }

          await account.save({ session });
        }
      }

      // Mark general ledger entries as deleted
      await GeneralLedger.updateMany(
        { journalEntryId: journalEntry._id },
        { del_flag: true },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      revalidatePath("/");
      return { success: true };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteJournalEntry(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const entry = await JournalEntry.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, status: "draft" },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!entry) {
      return { error: "Journal entry not found or already posted" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "journal_entry",
      resourceId: String(id),
      details: { before: entry },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createJournalEntry = await withAuth(_createJournalEntry);
export const postJournalEntry = await withAuth(_postJournalEntry);
export const getJournalEntries = await withAuth(_getJournalEntries);
export const getJournalEntryById = await withAuth(_getJournalEntryById);
export const updateJournalEntry = await withAuth(_updateJournalEntry);
export const voidJournalEntry = await withAuth(_voidJournalEntry);
export const deleteJournalEntry = await withAuth(_deleteJournalEntry);
