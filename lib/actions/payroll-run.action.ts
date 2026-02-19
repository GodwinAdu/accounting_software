"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import PayrollRun from "../models/payroll-run.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createPayrollRun(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastRun = await PayrollRun.findOne({ organizationId: user.organizationId })
      .sort({ runNumber: -1 })
      .select("runNumber");

    let nextNumber = 1;
    if (lastRun?.runNumber) {
      const lastNum = parseInt(lastRun.runNumber.split("-")[1]);
      nextNumber = lastNum + 1;
    }
    const runNumber = `RUN-${String(nextNumber).padStart(6, "0")}`;

    const payrollRun = await PayrollRun.create({
      ...data,
      organizationId: user.organizationId,
      runNumber,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "payroll_run",
      resourceId: String(payrollRun._id),
      details: { after: payrollRun },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(payrollRun)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getPayrollRuns(user: any) {
  try {
    await connectToDB();

    const runs = await PayrollRun.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate({
        path: "employeePayments.employeeId",
        select: "employeeNumber userId",
        populate: { path: "userId", select: "fullName" }
      })
      .sort({ payDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(runs)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getPayrollRunById(user: any, id: string) {
  try {
    await connectToDB();

    const run = await PayrollRun.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate({
      path: "employeePayments.employeeId",
      select: "employeeNumber userId",
      populate: { path: "userId", select: "fullName" }
    });

    if (!run) {
      return { error: "Payroll run not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(run)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updatePayrollRun(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldRun = await PayrollRun.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldRun) {
      return { error: "Payroll run not found" };
    }

    const run = await PayrollRun.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!run) {
      return { error: "Payroll run not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "payroll_run",
      resourceId: String(id),
      details: { before: oldRun, after: run },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(run)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deletePayrollRun(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const run = await PayrollRun.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!run) {
      return { error: "Payroll run not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "payroll_run",
      resourceId: String(id),
      details: { before: run },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _processPayroll(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const run = await PayrollRun.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, status: "draft" },
      {
        status: "completed",
        processedBy: user._id,
        processedAt: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!run) {
      return { error: "Payroll run not found or already processed" };
    }

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(run)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createPayrollRun = await withAuth(_createPayrollRun);
export const getPayrollRuns = await withAuth(_getPayrollRuns);
export const getPayrollRunById = await withAuth(_getPayrollRunById);
export const updatePayrollRun = await withAuth(_updatePayrollRun);
export const deletePayrollRun = await withAuth(_deletePayrollRun);
export const processPayroll = await withAuth(_processPayroll);
