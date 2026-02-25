"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import EmployeeLoan from "../models/employee-loan.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createEmployeeLoan(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    console.log("Creating employee loan:", data);

    const monthlyDeduction = data.amount / data.repaymentMonths;

    const loan = await EmployeeLoan.create({
      ...data,
      monthlyDeduction,
      outstandingBalance: data.amount,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    console.log("Loan created:", loan);

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "employee_loan",
      resourceId: String(loan._id),
      details: { after: loan },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    console.error("Error creating loan:", error);
    return { error: error.message };
  }
}

async function _getEmployeeLoans(user: any, employeeId?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (employeeId) query.employeeId = employeeId;

    const loans = await EmployeeLoan.find(query)
      .populate({
        path: "employeeId",
        select: "employeeNumber userId",
        populate: { path: "userId", select: "fullName" }
      })
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(loans)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _approveEmployeeLoan(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const loan = await EmployeeLoan.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, status: "pending" },
      {
        status: "active",
        approvedBy: user._id,
        approvedAt: new Date(),
        startDate: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!loan) {
      return { error: "Loan request not found or already processed" };
    }

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _rejectEmployeeLoan(user: any, id: string, reason: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const loan = await EmployeeLoan.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, status: "pending" },
      {
        status: "rejected",
        rejectionReason: reason,
        approvedBy: user._id,
        approvedAt: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!loan) {
      return { error: "Loan request not found or already processed" };
    }

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(loan)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createEmployeeLoan = await withAuth(_createEmployeeLoan);
export const getEmployeeLoans = await withAuth(_getEmployeeLoans);
export const approveEmployeeLoan = await withAuth(_approveEmployeeLoan);
export const rejectEmployeeLoan = await withAuth(_rejectEmployeeLoan);
