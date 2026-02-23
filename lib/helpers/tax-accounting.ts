"use server";

import { connectToDB } from "../connection/mongoose";
import VATFiling from "../models/vat-filing.model";
import JournalEntry from "../models/journal-entry.model";
import Account from "../models/account.model";

async function getDefaultAccount(organizationId: string, accountName: string) {
  await connectToDB();
  const account = await Account.findOne({
    organizationId,
    name: { $regex: new RegExp(accountName, "i") },
    del_flag: false,
  });
  return account?._id;
}

export async function postVATFilingToGL(filingId: string, userId: string) {
  try {
    await connectToDB();

    const filing = await VATFiling.findById(filingId);
    if (!filing) throw new Error("VAT filing not found");

    const vatPayableAccount = filing.vatPayableAccountId || await getDefaultAccount(String(filing.organizationId), "VAT Payable");
    const bankAccount = await getDefaultAccount(String(filing.organizationId), "Bank");

    if (!vatPayableAccount || !bankAccount) {
      throw new Error("Required accounts not found");
    }

    const lineItems = [
      {
        accountId: vatPayableAccount,
        description: `VAT payment - ${filing.filingNumber}`,
        debit: filing.vatAmount,
        credit: 0,
      },
      {
        accountId: bankAccount,
        description: `VAT payment - ${filing.filingNumber}`,
        debit: 0,
        credit: filing.vatAmount,
      },
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: filing.organizationId,
      entryNumber: `JE-VAT-${Date.now().toString().slice(-8)}`,
      entryDate: filing.filedDate,
      referenceType: "vat_filing",
      referenceId: filingId,
      description: `VAT filing ${filing.filingNumber} - ${filing.filingMonth}`,
      lineItems,
      totalDebit: filing.vatAmount,
      totalCredit: filing.vatAmount,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    await VATFiling.findByIdAndUpdate(filingId, { journalEntryId: journalEntry._id });

    return { success: true };
  } catch (error: any) {
    console.error("Post VAT filing to GL error:", error);
    return { error: error.message };
  }
}
