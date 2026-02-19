"use client"

import { createContext, useContext, ReactNode } from "react"

type OrganizationSettings = {
  timezone: string
  currency: string
  fiscalYearStart: string
  dateFormat: string
  timeFormat: string
  language: string
  numberFormat: string
  weekStart: string
  paymentSettings: {
    defaultPaymentMethod?: string
    acceptedPaymentMethods: string[]
    paymentTerms: number
    lateFeePercentage: number
    earlyPaymentDiscount: number
    preferredPaymentGateway?: string
  }
  invoiceSettings: {
    invoicePrefix: string
    invoiceNumberFormat: string
    nextInvoiceNumber: number
    defaultNotes?: string
    defaultTerms?: string
    showTaxNumber: boolean
    showLogo: boolean
  }
  taxSettings: {
    taxRegistered: boolean
    taxNumber?: string
    taxRate: number
    taxType?: string
    enableTaxCalculation: boolean
  }
  payrollSettings: {
    payrollFrequency: string
    overtimeRate: number
    enableTimeTracking: boolean
    enableLeaveManagement: boolean
    defaultWorkingHours: number
    defaultWorkingDays: number
  }
  emailSettings: {
    fromName?: string
    fromEmail?: string
    replyToEmail?: string
    enableEmailNotifications: boolean
  }
}

const OrganizationSettingsContext = createContext<OrganizationSettings | null>(null)

export function OrganizationSettingsProvider({
  children,
  settings,
}: {
  children: ReactNode
  settings: OrganizationSettings
}) {
  return (
    <OrganizationSettingsContext.Provider value={settings}>
      {children}
    </OrganizationSettingsContext.Provider>
  )
}

export function useOrganizationSettings() {
  const context = useContext(OrganizationSettingsContext)
  if (!context) {
    throw new Error("useOrganizationSettings must be used within OrganizationSettingsProvider")
  }
  return context
}
