"use server"

import { withAuth, type User } from "../helpers/auth"
import { processPayment, verifyPayment, getConnectedPaymentGateways } from "../helpers/payment"
import { connectToDB } from "../connection/mongoose"
import Invoice from "../models/invoice.model"
import Payment from "../models/payment.model"
import { revalidatePath } from "next/cache"
import { checkPermission } from "../helpers/check-permission"

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
      },
      provider: data.provider,
    })

    return { success: true, payment: paymentResult }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createInvoicePayment = await withAuth(_createInvoicePayment)

async function _verifyInvoicePayment(user: User, reference: string, provider?: string) {
  try {
    const paymentResult = await verifyPayment(reference, provider)
    return { success: true, payment: paymentResult }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const verifyInvoicePayment = await withAuth(_verifyInvoicePayment)

async function _getPayments(user: User) {
  try {
    const hasPermission = await checkPermission("payments_view")
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

async function _deletePayment(user: User, paymentId: string, path: string) {
  try {
    await connectToDB()

    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    )

    if (!payment) {
      return { error: "Payment not found" }
    }

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete payment" }
  }
}

export const deletePayment = await withAuth(_deletePayment)
