"use server";

import { connectToDB } from "../connection/mongoose";
import BankTransaction from "../models/bank-transaction.model";
import BankAccount from "../models/bank-account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { checkPermission } from "../helpers/check-permission";
import { createJournalEntryForBankTransaction } from "../helpers/journal-entry-helper";

interface CSVTransaction {
  date: string;
  description: string;
  amount: number;
  type: "deposit" | "withdrawal";
  reference?: string;
}

async function _importBankFeed(
  user: any,
  data: {
    bankAccountId: string;
    transactions: CSVTransaction[];
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankFeeds_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const bankAccount = await BankAccount.findOne({
      _id: data.bankAccountId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!bankAccount) {
      return { error: "Bank account not found" };
    }

    const results = {
      imported: 0,
      duplicates: 0,
      errors: 0,
      transactions: [] as any[],
    };

    for (const csvTx of data.transactions) {
      try {
        // Check for duplicates
        const duplicate = await BankTransaction.findOne({
          organizationId: user.organizationId,
          bankAccountId: data.bankAccountId,
          transactionDate: new Date(csvTx.date),
          amount: Math.abs(csvTx.amount),
          description: csvTx.description,
          del_flag: false,
        });

        if (duplicate) {
          results.duplicates++;
          continue;
        }

        // Generate transaction number
        const lastTransaction = await BankTransaction.findOne({ organizationId: user.organizationId })
          .sort({ createdAt: -1 })
          .select("transactionNumber");

        let nextNumber = 1;
        if (lastTransaction?.transactionNumber) {
          const lastNumber = parseInt(lastTransaction.transactionNumber.split("-")[1]);
          nextNumber = lastNumber + 1;
        }

        const transactionNumber = `BTX-${String(nextNumber).padStart(6, "0")}`;

        // Create transaction
        const transaction = await BankTransaction.create({
          organizationId: user.organizationId,
          bankAccountId: data.bankAccountId,
          transactionNumber,
          transactionDate: new Date(csvTx.date),
          transactionType: csvTx.type === "deposit" ? "deposit" : "withdrawal",
          amount: Math.abs(csvTx.amount),
          description: csvTx.description,
          referenceNumber: csvTx.reference,
          createdBy: user._id,
        });

        // Update bank balance
        if (csvTx.type === "deposit") {
          bankAccount.currentBalance += Math.abs(csvTx.amount);
        } else {
          bankAccount.currentBalance -= Math.abs(csvTx.amount);
        }

        // Create journal entry if linked
        if (bankAccount.accountId) {
          const jeResult = await createJournalEntryForBankTransaction(
            String(user.organizationId),
            String(user._id),
            {
              transactionId: String(transaction._id),
              transactionNumber,
              transactionDate: new Date(csvTx.date),
              description: csvTx.description,
              bankAccountGLId: String(bankAccount.accountId),
              amount: Math.abs(csvTx.amount),
              transactionType: csvTx.type === "deposit" ? "deposit" : "withdrawal",
            }
          );

          if (jeResult.success && jeResult.data) {
            transaction.journalEntryId = jeResult.data._id;
            await transaction.save();
          }
        }

        results.imported++;
        results.transactions.push(transaction);
      } catch (error: any) {
        results.errors++;
        console.error("Error importing transaction:", error);
      }
    }

    await bankAccount.save();

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank_feed_import",
      resourceId: String(data.bankAccountId),
      details: { after: results },
    });

    return { success: true, data: results };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const importBankFeed = await withAuth(_importBankFeed);
