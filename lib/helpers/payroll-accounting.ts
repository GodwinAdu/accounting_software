"use server";

import { connectToDB } from "../connection/mongoose";
import PayrollRun from "../models/payroll-run.model";
import JournalEntry from "../models/journal-entry.model";
import Account from "../models/account.model";

async function getDefaultAccount(organizationId: string, accountName: string, accountType: string, accountCode: string) {
  await connectToDB();
  let account = await Account.findOne({
    organizationId,
    name: { $regex: new RegExp(accountName, "i") },
    del_flag: false,
  });
  
  if (!account) {
    account = await Account.create({
      organizationId,
      code: accountCode,
      name: accountName,
      type: accountType,
      category: accountType === "expense" ? "operating_expenses" : "current_liabilities",
      balance: 0,
      isActive: true,
      del_flag: false,
      mod_flag: 0,
    });
  }
  
  return account._id;
}

export async function postPayrollToGL(payrollRunId: string, userId: string) {
  try {
    await connectToDB();

    const payrollRun = await PayrollRun.findById(payrollRunId).populate("organizationId");
    if (!payrollRun) throw new Error("Payroll run not found");

    const org = payrollRun.organizationId as any;
    const salaryExpenseAccount = org?.payrollSettings?.salaryExpenseAccountId || await getDefaultAccount(String(payrollRun.organizationId), "Salary Expense", "expense", "6100");
    const salaryPayableAccount = org?.payrollSettings?.salaryPayableAccountId || await getDefaultAccount(String(payrollRun.organizationId), "Salaries Payable", "liability", "2100");
    const taxPayableAccount = org?.payrollSettings?.taxPayableAccountId || await getDefaultAccount(String(payrollRun.organizationId), "Tax Payable", "liability", "2200");

    if (!salaryExpenseAccount || !salaryPayableAccount || !taxPayableAccount) {
      throw new Error("Required accounts not found");
    }

    const lineItems = [
      {
        accountId: salaryExpenseAccount,
        description: `Salary expense - ${payrollRun.runNumber}`,
        debit: payrollRun.totalGrossPay,
        credit: 0,
      },
      {
        accountId: taxPayableAccount,
        description: `Tax deductions - ${payrollRun.runNumber}`,
        debit: 0,
        credit: payrollRun.totalDeductions,
      },
      {
        accountId: salaryPayableAccount,
        description: `Net salary payable - ${payrollRun.runNumber}`,
        debit: 0,
        credit: payrollRun.totalNetPay,
      },
    ];

    await JournalEntry.create({
      organizationId: payrollRun.organizationId,
      entryNumber: `JE-PAY-${Date.now().toString().slice(-8)}`,
      entryDate: payrollRun.payDate,
      referenceType: "payroll",
      referenceId: payrollRunId,
      description: `Payroll run ${payrollRun.runNumber}`,
      lineItems,
      totalDebit: payrollRun.totalGrossPay,
      totalCredit: payrollRun.totalGrossPay,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Post payroll to GL error:", error);
    return { error: error.message };
  }
}
