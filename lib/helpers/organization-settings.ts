import { IOrganization } from "@/types";

export function formatCurrency(amount: number, organization?: any): string {
  const currency = organization?.settings?.currency || "GHS";
  const numberFormat = organization?.settings?.numberFormat || "1,234.56";
  
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `${currency} ${formatted}`;
}

export function formatDate(date: Date | string, organization?: any): string {
  const dateFormat = organization?.settings?.dateFormat || "DD/MM/YYYY";
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  
  switch (dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

export function formatTime(date: Date | string, organization?: any): string {
  const timeFormat = organization?.settings?.timeFormat || "24h";
  const d = new Date(date);
  
  if (timeFormat === "12h") {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function generateInvoiceNumber(
  lastNumber: number,
  organization?: any
): string {
  const prefix = organization?.invoiceSettings?.invoicePrefix || "INV";
  const format = organization?.invoiceSettings?.invoiceNumberFormat || "INV-{YYYY}-{####}";
  const nextNumber = lastNumber + 1;
  
  const year = new Date().getFullYear();
  const paddedNumber = String(nextNumber).padStart(4, "0");
  
  return format
    .replace("{YYYY}", String(year))
    .replace("{####}", paddedNumber)
    .replace("{prefix}", prefix);
}

export function calculateTax(amount: number, organization?: any): number {
  if (!organization?.taxSettings?.enableTaxCalculation) return 0;
  
  const taxRate = organization?.taxSettings?.taxRate || 0;
  return (amount * taxRate) / 100;
}

export function calculateOvertime(
  hours: number,
  hourlyRate: number,
  organization?: any
): number {
  const overtimeRate = organization?.payrollSettings?.overtimeRate || 1.5;
  const defaultHours = organization?.payrollSettings?.defaultWorkingHours || 8;
  
  if (hours <= defaultHours) return 0;
  
  const overtimeHours = hours - defaultHours;
  return overtimeHours * hourlyRate * overtimeRate;
}

export function getPaymentTermsDueDate(
  invoiceDate: Date,
  organization?: any
): Date {
  const paymentTerms = organization?.paymentSettings?.paymentTerms || 30;
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate;
}

export function applyLateFee(amount: number, organization?: any): number {
  const lateFeePercentage = organization?.paymentSettings?.lateFeePercentage || 0;
  return (amount * lateFeePercentage) / 100;
}

export function applyEarlyPaymentDiscount(
  amount: number,
  organization?: any
): number {
  const discount = organization?.paymentSettings?.earlyPaymentDiscount || 0;
  return (amount * discount) / 100;
}
