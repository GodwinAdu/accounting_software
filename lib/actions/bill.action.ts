"use server"

import { revalidatePath } from "next/cache"
import Bill, { IBill } from "@/lib/models/bill.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"
import { postBillToGL, postBillPaymentToGL } from "../helpers/purchases-accounting"

// Create Bill
async function _createBill(
  user: User,
  data: Partial<IBill>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("bills_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create bills" }
    }

    await connectToDB()

    // Generate bill number
    const billNumber = `BILL-${Date.now().toString().slice(-6)}`

    const bill = await Bill.create({
      ...data,
      billNumber,
      organizationId: user.organizationId,
      createdBy: user._id || user.id,
      mod_flag: false,
      del_flag: false
    })

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bill",
      resourceId: String(bill._id),
      details: { after: bill },
    })

    // Auto-post to GL if status is 'open' or 'paid'
    if (data.status === "open" || data.status === "paid") {
      await postBillToGL(String(bill._id), String(user._id || user.id))
    }

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(bill)) }
  } catch (error: any) {
    console.error("Create bill error:", error)
    return { error: error.message || "Failed to create bill" }
  }
}

export const createBill = await withAuth(_createBill)

// Get Bills
async function _getBills(user: User) {
  try {
    const hasPermission = await checkPermission("bills_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view bills" }
    }

    await connectToDB()

    const bills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName")
      .sort({ billDate: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(bills)) }
  } catch (error: any) {
    console.error("Get bills error:", error)
    return { error: error.message || "Failed to fetch bills" }
  }
}

export const getBills = await withAuth(_getBills)

// Get Bill by ID
async function _getBillById(user: User, billId: string) {
  try {
    const hasPermission = await checkPermission("bills_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view bills" }
    }

    await connectToDB()

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName email phone")
      .lean()

    if (!bill) {
      return { error: "Bill not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(bill)) }
  } catch (error: any) {
    console.error("Get bill error:", error)
    return { error: error.message || "Failed to fetch bill" }
  }
}

export const getBillById = await withAuth(_getBillById)

// Update Bill
async function _updateBill(
  user: User,
  billId: string,
  data: Partial<IBill>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("bills_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update bills" }
    }

    await connectToDB()

    const oldBill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldBill) {
      return { error: "Bill not found" }
    }

    const bill = await Bill.findOneAndUpdate(
      {
        _id: billId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        ...data,
        modifiedBy: user.id,
        mod_flag: true
      },
      { new: true }
    )

    if (!bill) {
      return { error: "Bill not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "bill",
      resourceId: String(billId),
      details: { before: oldBill, after: bill },
    })

    // Post to GL if status changed to 'open' or if payment made
    if ((data.status === "open" || data.status === "paid") && oldBill.status === "draft") {
      await postBillToGL(String(billId), String(user._id || user.id))
    }
    
    // Post payment if amount paid increased
    if (data.amountPaid && data.amountPaid > oldBill.amountPaid) {
      const paymentAmount = data.amountPaid - oldBill.amountPaid
      await postBillPaymentToGL(String(billId), paymentAmount, "", String(user._id || user.id))
    }

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(bill)) }
  } catch (error: any) {
    console.error("Update bill error:", error)
    return { error: error.message || "Failed to update bill" }
  }
}

export const updateBill = await withAuth(_updateBill)

// Delete Bill
async function _deleteBill(
  user: User,
  billId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("bills_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete bills" }
    }

    await connectToDB()

    const bill = await Bill.findOneAndUpdate(
      {
        _id: billId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!bill) {
      return { error: "Bill not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "bill",
      resourceId: String(billId),
      details: { before: bill },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete bill error:", error)
    return { error: error.message || "Failed to delete bill" }
  }
}

export const deleteBill = await withAuth(_deleteBill)

// Approve Bill (Change from draft to open)
async function _approveBill(
  user: User,
  billId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("bills_update")
    if (!hasPermission) {
      return { error: "You don't have permission to approve bills" }
    }

    await connectToDB()

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!bill) {
      return { error: "Bill not found" }
    }

    if (bill.status !== "draft") {
      return { error: "Only draft bills can be approved" }
    }

    bill.status = "open"
    bill.modifiedBy = user._id || user.id
    bill.mod_flag = true
    await bill.save()

    // Post to GL
    await postBillToGL(String(billId), String(user._id || user.id))

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "approve",
      resource: "bill",
      resourceId: String(billId),
      details: { metadata: { action: "approved", status: "open" } },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(bill)) }
  } catch (error: any) {
    console.error("Approve bill error:", error)
    return { error: error.message || "Failed to approve bill" }
  }
}

export const approveBill = await withAuth(_approveBill)

// Record Bill Payment
async function _recordBillPayment(
  user: User,
  billId: string,
  amount: number,
  paymentDate: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("bills_update")
    if (!hasPermission) {
      return { error: "You don't have permission to record payments" }
    }

    await connectToDB()

    const bill = await Bill.findOne({
      _id: billId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!bill) {
      return { error: "Bill not found" }
    }

    if (bill.status !== "open" && bill.status !== "overdue") {
      return { error: "Only open or overdue bills can receive payments" }
    }

    if (amount > bill.balance) {
      return { error: "Payment amount cannot exceed balance" }
    }

    bill.amountPaid = (bill.amountPaid || 0) + amount
    bill.balance = bill.total - bill.amountPaid
    bill.status = bill.balance === 0 ? "paid" : bill.status
    bill.modifiedBy = user._id || user.id
    bill.mod_flag = true
    await bill.save()

    // Post payment to GL
    await postBillPaymentToGL(String(billId), amount, "", String(user._id || user.id))

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "payment",
      resource: "bill",
      resourceId: String(billId),
      details: { metadata: { amount, paymentDate, newBalance: bill.balance } },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(bill)) }
  } catch (error: any) {
    console.error("Record payment error:", error)
    return { error: error.message || "Failed to record payment" }
  }
}

export const recordBillPayment = await withAuth(_recordBillPayment)
