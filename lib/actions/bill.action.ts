"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Bill from "../models/bill.model";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { postBillToGL, postBillPaymentToGL } from "../helpers/purchase-accounting";

async function _createBill(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastBill = await Bill.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .lean();
    
    const billNumber = data.billNumber || `BILL-${String((lastBill ? parseInt(lastBill.billNumber.split('-')[1]) : 0) + 1).padStart(5, '0')}`;

    const bill = await Bill.create({
      ...data,
      billNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      balance: data.total,
      mod_flag: false,
      del_flag: false
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "create",
      resource: "bill",
      resourceId: String(bill._id),
      details: { after: bill },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBills(user: User) {
  try {
    await connectToDB();

    const bills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName email")
      .sort({ billDate: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(bills)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBillById(user: User, billId: string) {
  try {
    await connectToDB();

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName email phone")
      .lean();

    if (!bill) {
      return { error: "Bill not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateBill(user: User, billId: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldBill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldBill) {
      return { error: "Bill not found" };
    }

    if (oldBill.status === "paid") {
      return { error: "Cannot update paid bill" };
    }

    const bill = await Bill.findOneAndUpdate(
      { _id: billId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "update",
      resource: "bill",
      resourceId: String(billId),
      details: { before: oldBill, after: bill },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteBill(user: User, billId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const bill = await Bill.findOneAndUpdate(
      { _id: billId, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!bill) {
      return { error: "Bill not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "delete",
      resource: "bill",
      resourceId: String(billId),
      details: { before: bill },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _approveBill(user: User, billId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!bill) {
      return { error: "Bill not found" };
    }

    if (bill.status !== "draft") {
      return { error: "Only draft bills can be approved" };
    }

    bill.status = "open";
    bill.modifiedBy = user._id;
    bill.mod_flag = true;
    await bill.save();

    // Post to GL
    const glResult = await postBillToGL(String(bill._id), String(user._id));
    if (glResult.error) {
      return { error: glResult.error };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "approve",
      resource: "bill",
      resourceId: String(billId),
      details: { status: "open", journalEntryId: glResult.journalEntryId },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _recordBillPayment(user: User, billId: string, paymentData: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!bill) {
      return { error: "Bill not found" };
    }

    const paymentAmount = paymentData.amount;
    if (paymentAmount > bill.balance) {
      return { error: "Payment amount exceeds bill balance" };
    }

    bill.amountPaid += paymentAmount;
    bill.balance -= paymentAmount;
    bill.status = bill.balance === 0 ? "paid" : "open";
    bill.modifiedBy = user._id;
    bill.mod_flag = true;
    await bill.save();

    // Post payment to GL
    const glResult = await postBillPaymentToGL(
      paymentData.paymentId || String(bill._id),
      String(bill._id),
      paymentAmount,
      paymentData.paymentDate || new Date(),
      String(user._id)
    );

    if (glResult.error) {
      return { error: glResult.error };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "payment",
      resource: "bill",
      resourceId: String(billId),
      details: { amount: paymentAmount, balance: bill.balance },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(bill)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBill = await withAuth(_createBill);
export const getBills = await withAuth(_getBills);
export const getBillById = await withAuth(_getBillById);
export const updateBill = await withAuth(_updateBill);
export const deleteBill = await withAuth(_deleteBill);
export const approveBill = await withAuth(_approveBill);
export const recordBillPayment = await withAuth(_recordBillPayment);
