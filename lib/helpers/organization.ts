"use server"

import { connectToDB } from "../connection/mongoose"
import Organization from "../models/organization.model"
import { currentUser } from "./session"

export async function getOrganizationSettings() {
  const user = await currentUser()
  if (!user) return null

  await connectToDB()
  const org = await Organization.findById(user.organizationId).lean()
  
  if (!org) return null

  return {
    timezone: org.settings?.timezone || "Africa/Accra",
    currency: org.settings?.currency || "GHS",
    fiscalYearStart: org.settings?.fiscalYearStart || "01-01",
    dateFormat: org.settings?.dateFormat || "DD/MM/YYYY",
    timeFormat: org.settings?.timeFormat || "24h",
    language: org.settings?.language || "en",
    numberFormat: org.settings?.numberFormat || "1,234.56",
    weekStart: org.settings?.weekStart || "Monday",
    paymentSettings: {
      defaultPaymentMethod: org.paymentSettings?.defaultPaymentMethod,
      acceptedPaymentMethods: org.paymentSettings?.acceptedPaymentMethods || [],
      paymentTerms: org.paymentSettings?.paymentTerms || 30,
      lateFeePercentage: org.paymentSettings?.lateFeePercentage || 0,
      earlyPaymentDiscount: org.paymentSettings?.earlyPaymentDiscount || 0,
      preferredPaymentGateway: (org.paymentSettings as any)?.preferredPaymentGateway,
    },
    invoiceSettings: {
      invoicePrefix: org.invoiceSettings?.invoicePrefix || "INV",
      invoiceNumberFormat: org.invoiceSettings?.invoiceNumberFormat || "INV-{YYYY}-{####}",
      nextInvoiceNumber: org.invoiceSettings?.nextInvoiceNumber || 1,
      defaultNotes: org.invoiceSettings?.defaultNotes,
      defaultTerms: org.invoiceSettings?.defaultTerms,
      showTaxNumber: org.invoiceSettings?.showTaxNumber ?? true,
      showLogo: org.invoiceSettings?.showLogo ?? true,
    },
    taxSettings: {
      taxRegistered: org.taxSettings?.taxRegistered || false,
      taxNumber: org.taxSettings?.taxNumber,
      taxRate: org.taxSettings?.taxRate || 0,
      taxType: org.taxSettings?.taxType,
      enableTaxCalculation: org.taxSettings?.enableTaxCalculation ?? true,
    },
    payrollSettings: {
      payrollFrequency: org.payrollSettings?.payrollFrequency || "monthly",
      overtimeRate: org.payrollSettings?.overtimeRate || 1.5,
      enableTimeTracking: org.payrollSettings?.enableTimeTracking ?? true,
      enableLeaveManagement: org.payrollSettings?.enableLeaveManagement ?? true,
      defaultWorkingHours: org.payrollSettings?.defaultWorkingHours || 8,
      defaultWorkingDays: org.payrollSettings?.defaultWorkingDays || 5,
    },
    emailSettings: {
      fromName: org.emailSettings?.fromName,
      fromEmail: org.emailSettings?.fromEmail,
      replyToEmail: org.emailSettings?.replyToEmail,
      enableEmailNotifications: org.emailSettings?.enableEmailNotifications ?? true,
    },
  }
}
