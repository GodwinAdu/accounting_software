"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import LeaveRequest from "../models/leave-request.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createLeaveRequest(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const leaveRequest = await LeaveRequest.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "leave_request",
      resourceId: String(leaveRequest._id),
      details: { after: leaveRequest },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(leaveRequest)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getLeaveRequests(user: any) {
  try {
    await connectToDB();

    const requests = await LeaveRequest.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate({
        path: "employeeId",
        select: "employeeNumber userId",
        populate: { path: "userId", select: "fullName" }
      })
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getLeaveRequestById(user: any, id: string) {
  try {
    await connectToDB();

    const request = await LeaveRequest.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate({
      path: "employeeId",
      select: "employeeNumber userId",
      populate: { path: "userId", select: "fullName" }
    });

    if (!request) {
      return { error: "Leave request not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(request)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateLeaveRequest(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldRequest = await LeaveRequest.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldRequest) {
      return { error: "Leave request not found" };
    }

    const request = await LeaveRequest.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!request) {
      return { error: "Leave request not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "leave_request",
      resourceId: String(id),
      details: { before: oldRequest, after: request },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(request)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteLeaveRequest(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const request = await LeaveRequest.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!request) {
      return { error: "Leave request not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "leave_request",
      resourceId: String(id),
      details: { before: request },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _approveLeaveRequest(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const request = await LeaveRequest.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, status: "pending" },
      {
        status: "approved",
        approvedBy: user._id,
        approvedAt: new Date(),
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!request) {
      return { error: "Leave request not found or already processed" };
    }

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(request)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _rejectLeaveRequest(user: any, id: string, reason: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const request = await LeaveRequest.findOneAndUpdate(
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

    if (!request) {
      return { error: "Leave request not found or already processed" };
    }

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(request)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createLeaveRequest = await withAuth(_createLeaveRequest);
export const getLeaveRequests = await withAuth(_getLeaveRequests);
export const getLeaveRequestById = await withAuth(_getLeaveRequestById);
export const updateLeaveRequest = await withAuth(_updateLeaveRequest);
export const deleteLeaveRequest = await withAuth(_deleteLeaveRequest);
export const approveLeaveRequest = await withAuth(_approveLeaveRequest);
export const rejectLeaveRequest = await withAuth(_rejectLeaveRequest);
