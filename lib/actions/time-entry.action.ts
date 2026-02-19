"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import TimeEntry from "../models/time-entry.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createTimeEntry(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const timeEntry = await TimeEntry.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "time_entry",
      resourceId: String(timeEntry._id),
      details: { after: timeEntry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(timeEntry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getTimeEntries(user: any) {
  try {
    await connectToDB();

    const entries = await TimeEntry.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate({
        path: "employeeId",
        select: "employeeNumber userId",
        populate: { path: "userId", select: "fullName" }
      })
      .sort({ date: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(entries)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getTimeEntryById(user: any, id: string) {
  try {
    await connectToDB();

    const entry = await TimeEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate({
      path: "employeeId",
      select: "employeeNumber userId",
      populate: { path: "userId", select: "fullName" }
    });

    if (!entry) {
      return { error: "Time entry not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(entry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateTimeEntry(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldEntry = await TimeEntry.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldEntry) {
      return { error: "Time entry not found" };
    }

    const entry = await TimeEntry.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
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
      resourceId: String(id),
      details: { before: oldEntry, after: entry },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(entry)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteTimeEntry(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const entry = await TimeEntry.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!entry) {
      return { error: "Time entry not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "time_entry",
      resourceId: String(id),
      details: { before: entry },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createTimeEntry = await withAuth(_createTimeEntry);
export const getTimeEntries = await withAuth(_getTimeEntries);
export const getTimeEntryById = await withAuth(_getTimeEntryById);
export const updateTimeEntry = await withAuth(_updateTimeEntry);
export const deleteTimeEntry = await withAuth(_deleteTimeEntry);
