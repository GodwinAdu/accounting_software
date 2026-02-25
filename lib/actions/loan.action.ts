"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Loan from "@/lib/models/loan.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { revalidatePath } from "next/cache";
import { withAuth, type User } from "@/lib/helpers/auth";
import { calculateLoanPayment } from "@/lib/helpers/loan-payment";
import JournalEntry from "../models/journal-entry.model";

async function _createLoan(user: User, data: any) {
  try {
    const hasPermission = await checkPermission("loans_create");
    if (!hasPermission) return { error: "You don't have permission to create loans" };

    await connectToDB();

    const count = await Loan.countDocuments({ organizationId: user.organizationId });
    const loanNumber = `LOAN-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const paymentAmount = calculateLoanPayment(
      data.principalAmount,
      data.interestRate,
      data.loanTerm
    );

    const loan = await Loan.create({
      ...data,
      loanNumber,
      paymentAmount,
      organizationId: user.organizationId,
      createdBy: user._id || user.id,
      outstandingBalance: data.principalAmount,
    });

    revalidatePath(`/${user.organizationId}/dashboard/${user._id}/loans/all`);
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createLoan = await withAuth(_createLoan);

async function _getLoans(user: User) {
  try {
    const hasPermission = await checkPermission("loans_view");
    if (!hasPermission) return { error: "You don't have permission to view loans" };

    await connectToDB();

    const loans = await Loan.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(loans)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getLoans = await withAuth(_getLoans);

async function _getLoanById(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("loans_view");
    if (!hasPermission) return { error: "You don't have permission to view loans" };

    await connectToDB();

    const loan = await Loan.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!loan) return { error: "Loan not found" };
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getLoanById = await withAuth(_getLoanById);

async function _updateLoan(user: User, id: string, data: any) {
  try {
    const hasPermission = await checkPermission("loans_edit");
    if (!hasPermission) return { error: "You don't have permission to edit loans" };

    await connectToDB();

    const loan = await Loan.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id || user.id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!loan) return { error: "Loan not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/loans/all`);
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateLoan = await withAuth(_updateLoan);

async function _deleteLoan(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("loans_delete");
    if (!hasPermission) return { error: "You don't have permission to delete loans" };

    await connectToDB();

    const loan = await Loan.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId },
      { del_flag: true, deletedBy: user._id || user.id },
      { new: true }
    );

    if (!loan) return { error: "Loan not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/loans/all`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const deleteLoan = await withAuth(_deleteLoan);

async function _processLoanPayment(
  user: User,
  loanId: string,
  paymentAmount: number,
  paymentDate: Date,
  cashAccountId: string
) {
  try {
    const hasPermission = await checkPermission("loans_edit");
    if (!hasPermission) return { error: "You don't have permission to process loan payments" };

    await connectToDB();

    const loan = await Loan.findOne({ _id: loanId, organizationId: user.organizationId, del_flag: false });
    if (!loan) return { error: "Loan not found" };

    const monthlyRate = loan.interestRate / 100 / 12;
    const interestPayment = loan.outstandingBalance * monthlyRate;
    const principalPayment = paymentAmount - interestPayment;

    const journalEntry = await JournalEntry.create({
      organizationId: user.organizationId,
      entryNumber: `LP-${new Date().toISOString().slice(0, 7)}-${loan.loanNumber}`,
      date: paymentDate,
      description: `Loan payment for ${loan.loanName}`,
      type: "loan_payment",
      status: "posted",
      lineItems: [
        {
          accountId: loan.loanAccountId,
          description: `Principal payment - ${loan.loanName}`,
          debit: principalPayment,
          credit: 0,
        },
        {
          accountId: loan.interestAccountId,
          description: `Interest payment - ${loan.loanName}`,
          debit: interestPayment,
          credit: 0,
        },
        {
          accountId: cashAccountId,
          description: `Loan payment - ${loan.loanName}`,
          debit: 0,
          credit: paymentAmount,
        },
      ],
      totalDebit: paymentAmount,
      totalCredit: paymentAmount,
      del_flag: false,
      createdBy: user._id || user.id,
      mod_flag: 0,
    });

    const newBalance = loan.outstandingBalance - principalPayment;
    await Loan.findByIdAndUpdate(loanId, {
      outstandingBalance: Math.max(0, newBalance),
      totalPrincipalPaid: loan.totalPrincipalPaid + principalPayment,
      totalInterestPaid: loan.totalInterestPaid + interestPayment,
      status: newBalance <= 0 ? "paid-off" : "active",
    });

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/loans/all`);
    return {
      success: true,
      journalEntry: journalEntry.entryNumber,
      principalPayment,
      interestPayment,
      newBalance: Math.max(0, newBalance),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const processLoanPayment = await withAuth(_processLoanPayment);
