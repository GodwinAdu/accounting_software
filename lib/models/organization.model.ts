import { Model, model, models, Schema } from "mongoose"

interface IOrganization {
  owner?: Schema.Types.ObjectId
  organizationCode: string
  name: string
  logo?: string
  email?: string
  phone?: string
  website?: string
  taxId?: string
  registrationNumber?: string
  industry?: string
  companySize?: string
  
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  
  settings: {
    timezone?: string
    currency?: string
    fiscalYearStart?: string
    dateFormat?: string
    timeFormat?: string
    language?: string
    numberFormat?: string
    weekStart?: string
  }
  
  subscriptionPlan: {
    plan: "starter" | "professional" | "enterprise"
    status: "active" | "trial" | "grace_period" | "suspended" | "expired" | "cancelled"
    startDate?: Date
    expiryDate?: Date
    gracePeriodEnd?: Date
    lastPaymentDate?: Date
    employeeLimit?: number
    currentEmployees: number
  }
  
  paymentSettings: {
    defaultPaymentMethod?: string
    acceptedPaymentMethods: string[]
    paymentTerms?: number
    lateFeePercentage?: number
    earlyPaymentDiscount?: number
    bankDetails?: {
      bankName?: string
      accountName?: string
      accountNumber?: string
      routingNumber?: string
      swiftCode?: string
    }
    paymentProcessors?: Array<{
      name: string
      apiKey?: string
      enabled: boolean
    }>
  }
  
  invoiceSettings?: {
    invoicePrefix?: string
    invoiceNumberFormat?: string
    nextInvoiceNumber?: number
    defaultNotes?: string
    defaultTerms?: string
    showTaxNumber?: boolean
    showLogo?: boolean
  }
  
  taxSettings?: {
    taxRegistered?: boolean
    taxNumber?: string
    taxRate?: number
    taxType?: string
    enableTaxCalculation?: boolean
  }
  
  payrollSettings?: {
    payrollFrequency?: string
    payrollStartDate?: Date
    overtimeRate?: number
    enableTimeTracking?: boolean
    enableLeaveManagement?: boolean
    defaultWorkingHours?: number
    defaultWorkingDays?: number
  }
  
  emailSettings?: {
    fromName?: string
    fromEmail?: string
    replyToEmail?: string
    smtpHost?: string
    smtpPort?: number
    smtpUsername?: string
    smtpPassword?: string
    enableEmailNotifications?: boolean
  }
  
  notificationSettings?: {
    invoiceReminders?: boolean
    paymentReceived?: boolean
    lowStock?: boolean
    expenseApproval?: boolean
    payrollProcessed?: boolean
    subscriptionExpiry?: boolean
  }
  
  modules: {
    dashboard?: boolean
    banking?: boolean
    sales?: boolean
    expenses?: boolean
    payroll?: boolean
    accounting?: boolean
    tax?: boolean
    products?: boolean
    reports?: boolean
    settings?: boolean
    projects?: boolean
    crm?: boolean
    budgeting?: boolean
    assets?: boolean
    loans?: boolean
    equity?: boolean
    ai?: boolean
  }
  
  security: {
    twoFactorRequired?: boolean
    sessionTimeout?: number
    passwordExpiry?: number
    ipWhitelist?: string[]
    allowedDomains?: string[]
    loginAttempts?: number
    lockoutDuration?: number
  }
  
  isActive: boolean
  suspended: boolean
  
  createdBy?: Schema.Types.ObjectId
  modifiedBy?: Schema.Types.ObjectId
  mod_flag?: boolean
  del_flag?: boolean
}

const OrganizationSchema: Schema<IOrganization> = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  organizationCode: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  logo: String,
  email: String,
  phone: String,
  website: String,
  taxId: String,
  registrationNumber: String,
  industry: String,
  companySize: String,
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "Ghana" }
  },
  
  settings: {
    timezone: { type: String, default: "Africa/Accra" },
    currency: { type: String, default: "GHS" },
    fiscalYearStart: { type: String, default: "01-01" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    timeFormat: { type: String, default: "24h" },
    language: { type: String, default: "en" },
    numberFormat: { type: String, default: "1,234.56" },
    weekStart: { type: String, default: "Monday" }
  },
  
  subscriptionPlan: {
    plan: { 
      type: String, 
      enum: ["starter", "professional", "enterprise"],
      default: "starter"
    },
    status: {
      type: String,
      enum: ["active", "trial", "grace_period", "suspended", "expired", "cancelled"],
      default: "trial"
    },
    startDate: Date,
    expiryDate: Date,
    gracePeriodEnd: Date,
    lastPaymentDate: Date,
    employeeLimit: { type: Number, default: 10 },
    currentEmployees: { type: Number, default: 0 }
  },
  
  paymentSettings: {
    defaultPaymentMethod: String,
    acceptedPaymentMethods: {
      type: [String],
      default: ["Bank Transfer", "Credit Card", "Mobile Money"]
    },
    paymentTerms: { type: Number, default: 30 },
    lateFeePercentage: { type: Number, default: 0 },
    earlyPaymentDiscount: { type: Number, default: 0 },
    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      routingNumber: String,
      swiftCode: String
    },
    paymentProcessors: [{
      name: String,
      apiKey: String,
      enabled: { type: Boolean, default: false }
    }]
  },
  
  invoiceSettings: {
    invoicePrefix: { type: String, default: "INV" },
    invoiceNumberFormat: { type: String, default: "INV-{YYYY}-{####}" },
    nextInvoiceNumber: { type: Number, default: 1 },
    defaultNotes: String,
    defaultTerms: String,
    showTaxNumber: { type: Boolean, default: true },
    showLogo: { type: Boolean, default: true }
  },
  
  taxSettings: {
    taxRegistered: { type: Boolean, default: false },
    taxNumber: String,
    taxRate: { type: Number, default: 0 },
    taxType: String,
    enableTaxCalculation: { type: Boolean, default: true }
  },
  
  payrollSettings: {
    payrollFrequency: { type: String, default: "monthly" },
    payrollStartDate: Date,
    overtimeRate: { type: Number, default: 1.5 },
    enableTimeTracking: { type: Boolean, default: true },
    enableLeaveManagement: { type: Boolean, default: true },
    defaultWorkingHours: { type: Number, default: 8 },
    defaultWorkingDays: { type: Number, default: 5 }
  },
  
  emailSettings: {
    fromName: String,
    fromEmail: String,
    replyToEmail: String,
    smtpHost: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String,
    enableEmailNotifications: { type: Boolean, default: true }
  },
  
  notificationSettings: {
    invoiceReminders: { type: Boolean, default: true },
    paymentReceived: { type: Boolean, default: true },
    lowStock: { type: Boolean, default: true },
    expenseApproval: { type: Boolean, default: true },
    payrollProcessed: { type: Boolean, default: true },
    subscriptionExpiry: { type: Boolean, default: true }
  },
  
  modules: {
    dashboard: { type: Boolean, default: true },
    banking: { type: Boolean, default: true },
    sales: { type: Boolean, default: false },
    expenses: { type: Boolean, default: false },
    payroll: { type: Boolean, default: false },
    accounting: { type: Boolean, default: true },
    tax: { type: Boolean, default: false },
    products: { type: Boolean, default: false },
    reports: { type: Boolean, default: true },
    settings: { type: Boolean, default: true },
    projects: { type: Boolean, default: false },
    crm: { type: Boolean, default: false },
    budgeting: { type: Boolean, default: false },
    assets: { type: Boolean, default: false },
    loans: { type: Boolean, default: false },
    equity: { type: Boolean, default: false },
    ai: { type: Boolean, default: false }
  },
  
  security: {
    twoFactorRequired: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
    passwordExpiry: { type: Number, default: 90 },
    ipWhitelist: { type: [String], default: [] },
    allowedDomains: { type: [String], default: [] },
    loginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 30 }
  },
  
  isActive: { type: Boolean, default: true },
  suspended: { type: Boolean, default: false },
  
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  mod_flag: { type: Boolean, default: false },
  del_flag: { type: Boolean, default: false }
}, {
  timestamps: true,
  versionKey: false,
})

OrganizationSchema.index({ organizationCode: 1 })

type OrganizationModel = Model<IOrganization>

// Force model recreation to clear cache
if (models.Organization) {
  delete models.Organization
}

const Organization: OrganizationModel = model<IOrganization>("Organization", OrganizationSchema)

export default Organization
