"use server"

import { withAuth, type User } from "../helpers/auth"
import { processPayment, verifyPayment, getConnectedPaymentGateways } from "../helpers/payment"
import { connectToDB } from "../connection/mongoose"
import Invoice from "../models/invoice.model"
import Payment from "../models/payment.model"
import { revalidatePath } from "next/cache"
import { checkPermission } from "../helpers/check-permission"
import { postPaymentToGL } from "../helpers/sales-accounting"
import { logAudit } from "../helpers/audit"

async function _getAvailablePaymentMethods(user: User) {
  try {
    const gateways = await getConnectedPaymentGateways()
    return { success: true, gateways }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getAvailablePaymentMethods = await withAuth(_getAvailablePaymentMethods)

async function _createInvoicePayment(user: User, data: {
  invoiceId: string
  amount: number
  currency: string
  customerEmail: string
  provider?: string
  paymentMethod?: string
}) {
  try {
    await connectToDB()

    const invoice = await Invoice.findById(data.invoiceId)
    if (!invoice) {
      return { success: false, error: "Invoice not found" }
    }

    const paymentResult = await processPayment({
      amount: data.amount,
      currency: data.currency,
      email: data.customerEmail,
      reference: `inv_${data.invoiceId}_${Date.now()}`,
      metadata: {
        invoiceId: data.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
      },
      provider: data.provider,
    })

    // For manual payments, create payment record immediately
    if (data.provider === "manual" && paymentResult.status === "success") {
      const payment = await Payment.create({
        organizationId: user.organizationId,
        paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
        customerId: invoice.customerId,
        invoiceId: data.invoiceId,
        paymentDate: new Date(),
        amount: data.amount,
        paymentMethod: data.paymentMethod || "cash",
        reference: paymentResult.reference,
        status: "completed",
        createdBy: user._id,
        del_flag: false,
        mod_flag: false
      })
      
      // Post to GL
      await postPaymentToGL(String(payment._id), String(user._id))
      
      // Update invoice
      await Invoice.findByIdAndUpdate(data.invoiceId, {
        $inc: { paidAmount: data.amount },
        status: invoice.totalAmount - invoice.paidAmount <= data.amount ? "paid" : "sent"
      })
      
      await logAudit({
        organizationId: String(user.organizationId),
        userId: String(user._id),
        action: "create",
        resource: "payment",
        resourceId: String(payment._id),
        details: { after: payment }
      })
    }

    return { success: true, payment: paymentResult }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createInvoicePayment = await withAuth(_createInvoicePayment)

async function _createPayment(user: User, data: any, path: string) {
  try {
    const hasPermission = await checkPermission("paymentsReceived_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create payments" }
    }

    await connectToDB()

    const payment = await Payment.create({
      organizationId: user.organizationId,
      customerId: data.customerId,
      invoiceId: data.invoiceId,
      paymentNumber: data.paymentNumber,
      paymentDate: data.paymentDate,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      notes: data.notes,
      bankAccountId: data.bankAccountId,
      receivableAccountId: data.receivableAccountId,
      status: "completed",
      createdBy: user?._id,
      del_flag: false,
      mod_flag: false
    })

    await postPaymentToGL(String(payment._id), String(user._id))

    if (data.invoiceId) {
      const invoice = await Invoice.findById(data.invoiceId)
      if (invoice) {
        const newPaidAmount = (invoice.paidAmount || 0) + data.amount
        await Invoice.findByIdAndUpdate(data.invoiceId, {
          paidAmount: newPaidAmount,
          status: newPaidAmount >= invoice.totalAmount ? "paid" : "sent"
        })
      }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "create",
      resource: "payment",
      resourceId: String(payment._id),
      details: { after: payment }
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(payment)) }
  } catch (error: any) {
    console.error("Create payment error:", error)
    return { error: error.message || "Failed to create payment" }
  }
}

export const createPayment = await withAuth(_createPayment)

async function _verifyInvoicePayment(user: User, reference: string, provider?: string) {
  try {
    const paymentResult = await verifyPayment(reference, provider)
    
    // If payment successful, create payment record and post to GL
    if (paymentResult.status === "success" && paymentResult.metadata?.invoiceId) {
      await connectToDB()
      
      const payment = await Payment.create({
        organizationId: user.organizationId,
        paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
        customerId: paymentResult.metadata.customerId,
        invoiceId: paymentResult.metadata.invoiceId,
        paymentDate: new Date(),
        amount: paymentResult.amount,
        paymentMethod: "bank_transfer",
        reference: reference,
        status: "completed",
        createdBy: user._id,
        del_flag: false,
        mod_flag: false
      })
      
      // Post to GL
      await postPaymentToGL(String(payment._id), String(user._id))
      
      // Update invoice paid amount
      await Invoice.findByIdAndUpdate(paymentResult.metadata.invoiceId, {
        $inc: { paidAmount: paymentResult.amount },
        status: "paid"
      })
      
      await logAudit({
        organizationId: String(user.organizationId),
        userId: String(user._id),
        action: "create",
        resource: "payment",
        resourceId: String(payment._id),
        details: { after: payment }
      })
    }
    
    return { success: true, payment: paymentResult }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const verifyInvoicePayment = await withAuth(_verifyInvoicePayment)

async function _getPayments(user: User) {
  try {
    const hasPermission = await checkPermission("paymentsReceived_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view payments" }
    }

    await connectToDB()

    const payments = await Payment.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email")
      .populate("invoiceId", "invoiceNumber")
      .sort({ paymentDate: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(payments)) }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payments" }
  }
}

export const getPayments = await withAuth(_getPayments)

async function _getPaymentById(user: User, paymentId: string) {
  try {
    const hasPermission = await checkPermission("paymentsReceived_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view payments" }
    }

    await connectToDB()

    const payment = await Payment.findOne({
      _id: paymentId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email")
      .populate("invoiceId", "invoiceNumber")
      .lean()

    if (!payment) {
      return { error: "Payment not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(payment)) }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payment" }
  }
}

export const getPaymentById = await withAuth(_getPaymentById)

async function _updatePayment(user: User, paymentId: string, data: any, path: string) {
  try {
    const hasPermission = await checkPermission("paymentsReceived_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update payments" }
    }

    await connectToDB()

    const oldPayment = await Payment.findOne({
      _id: paymentId,
      organizationId: user.organizationId,
      del_flag: false,
    })

    if (!oldPayment) {
      return { error: "Payment not found" }
    }

    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId, organizationId: user.organizationId, del_flag: false },
      {
        ...data,
        modifiedBy: user._id,
        mod_flag: true,
      },
      { new: true }
    )

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "update",
      resource: "payment",
      resourceId: String(paymentId),
      details: { before: oldPayment, after: payment }
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(payment)) }
  } catch (error: any) {
    return { error: error.message || "Failed to update payment" }
  }
}

export const updatePayment = await withAuth(_updatePayment)

async function _deletePayment(user: User, paymentId: string, path: string) {
  try {
    const hasPermission = await checkPermission("paymentsReceived_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete payments" }
    }

    await connectToDB()

    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    )

    if (!payment) {
      return { error: "Payment not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "delete",
      resource: "payment",
      resourceId: String(paymentId),
      details: { before: payment }
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete payment" }
  }
}

export const deletePayment = await withAuth(_deletePayment)
