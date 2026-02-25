"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import TimeEntry from "../models/time-entry.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _clockIn(user: any, data: { employeeId: string; location?: string; notes?: string }) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await TimeEntry.findOne({
      organizationId: user.organizationId,
      employeeId: data.employeeId,
      date: { $gte: today, $lt: tomorrow },
      del_flag: false,
    });

    if (existingEntry) {
      if (!existingEntry.clockOut) {
        return { error: "Already clocked in. Please clock out first." };
      }
      return { error: "You have already clocked in today." };
    }

    const entry = await TimeEntry.create({
      organizationId: user.organizationId,
      employeeId: data.employeeId,
      date: new Date(),
      clockIn: new Date(),
      location: data.location,
      notes: data.notes,
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "time_entry",
      resourceId: String(entry._id),
      details: { after: entry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(entry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _clockOut(user: any, entryId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const entry = await TimeEntry.findOne({
      _id: entryId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!entry) {
      return { error: "Time entry not found" };
    }

    if (entry.clockOut) {
      return { error: "Already clocked out" };
    }

    const clockOut = new Date();
    const totalMinutes = Math.floor((clockOut.getTime() - entry.clockIn.getTime()) / 60000);
    const workMinutes = totalMinutes - entry.breakMinutes;
    const totalHours = workMinutes / 60;
    const regularHours = Math.min(totalHours, 8);
    const overtimeHours = Math.max(totalHours - 8, 0);

    entry.clockOut = clockOut;
    entry.totalHours = isNaN(totalHours) ? 0 : totalHours;
    entry.regularHours = isNaN(regularHours) ? 0 : regularHours;
    entry.overtimeHours = isNaN(overtimeHours) ? 0 : overtimeHours;
    entry.modifiedBy = user._id;
    entry.mod_flag += 1;
    await entry.save();

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "time_entry",
      resourceId: String(entryId),
      details: { after: entry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(entry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getTimeEntries(user: any, filters?: { employeeId?: string; startDate?: Date; endDate?: Date; status?: string }) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (filters?.employeeId) query.employeeId = filters.employeeId;
    if (filters?.status) query.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    const entries = await TimeEntry.find(query)
      .populate("employeeId", "employeeNumber userId")
      .populate({ path: "employeeId", populate: { path: "userId", select: "fullName" } })
      .populate("approvedBy", "fullName")
      .sort({ date: -1, clockIn: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(entries)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _approveTimeEntry(user: any, entryId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const entry = await TimeEntry.findOneAndUpdate(
      { _id: entryId, organizationId: user.organizationId, del_flag: false },
      {
        status: "approved",
        approvedBy: user._id,
        approvedAt: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!entry) {
      return { error: "Time entry not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "time_entry",
      resourceId: String(entryId),
      details: { after: entry },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _rejectTimeEntry(user: any, entryId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const entry = await TimeEntry.findOneAndUpdate(
      { _id: entryId, organizationId: user.organizationId, del_flag: false },
      {
        status: "rejected",
        approvedBy: user._id,
        approvedAt: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!entry) {
      return { error: "Time entry not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "time_entry",
      resourceId: String(entryId),
      details: { after: entry },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getCurrentClockIn(user: any, employeeId: string) {
  try {
    await connectToDB();

    const entry = await TimeEntry.findOne({
      organizationId: user.organizationId,
      employeeId,
      clockOut: null,
      del_flag: false,
    }).sort({ clockIn: -1 });

    return { success: true, data: entry ? JSON.parse(JSON.stringify(entry)) : null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const clockIn = await withAuth(_clockIn);
export const clockOut = await withAuth(_clockOut);
export const getTimeEntries = await withAuth(_getTimeEntries);
export const approveTimeEntry = await withAuth(_approveTimeEntry);
export const rejectTimeEntry = await withAuth(_rejectTimeEntry);
export const getCurrentClockIn = await withAuth(_getCurrentClockIn);
