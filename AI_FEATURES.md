# AI Features Documentation

## Overview
This document describes all AI features available across different modules in the accounting system. All features require the AI module to be enabled for the organization.

---

## Expenses Module

### 1. AI Categorization
**Function:** `categorizeExpense(description, amount, vendor?)`
**Purpose:** Suggests expense category and account based on description, amount, and vendor
**Returns:** 
```typescript
{
  success: boolean;
  suggestion: {
    category: string;
    account: string;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    tags: string[];
  }
}
```
**Usage:**
```typescript
const result = await categorizeExpense("Office supplies from Staples", 150, "Staples");
```

### 2. Receipt OCR
**Function:** `extractInvoiceData(imageBase64)`
**Purpose:** Extracts data from receipt/invoice images
**Returns:**
```typescript
{
  success: boolean;
  data: {
    vendor: string;
    amount: number;
    date: string;
    invoiceNumber: string;
    items: Array<{description: string, quantity: number, price: number}>;
    tax: number;
    confidence: "high" | "medium" | "low";
  }
}
```

### 3. Anomaly Detection
**Function:** `detectAnomalies()`
**Purpose:** Detects unusual expenses and potential duplicates
**Returns:**
```typescript
{
  success: boolean;
  anomalies: Array<{
    type: "unusual_amount" | "duplicate";
    severity: "high" | "medium" | "low";
    description: string;
    reference: string;
    date: Date;
  }>
}
```

---

## Sales/Invoices Module

### 1. Smart Invoice Suggestions
**Function:** `smartSearch(query)` (can be adapted for invoice suggestions)
**Purpose:** Analyzes customer history and suggests frequently ordered items

### 2. AI Email Generator
**Function:** `generateEmail(type, recipientName, amount?, invoiceNumber?, dueDate?)`
**Purpose:** Generates professional emails for invoices
**Types:** `payment_reminder`, `thank_you`, `overdue_notice`, `welcome`
**Returns:**
```typescript
{
  success: boolean;
  email: string;
}
```

### 3. Email Sending
**Function:** `sendEmail(recipientEmail, subject, body)`
**Purpose:** Sends emails directly via SMTP
**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

## Payroll Module

### 1. Salary Suggestions
**Function:** `suggestSalary(role, experience, industry?)`
**Purpose:** Suggests competitive salary ranges based on role and experience
**Returns:**
```typescript
{
  success: boolean;
  suggestion: {
    min: number;
    max: number;
    average: number;
    currency: "GHS";
    reasoning: string;
  }
}
```
**Example:**
```typescript
const result = await suggestSalary("Software Engineer", 5, "Technology");
// Returns: { min: 8000, max: 15000, average: 11500, currency: "GHS", reasoning: "..." }
```

### 2. Payroll Analysis
**Function:** `analyzePayroll()`
**Purpose:** Analyzes payroll data for cost optimization and anomalies
**Returns:**
```typescript
{
  success: boolean;
  insights: string;
  anomalies: number;
}
```

---

## Accounting Module

### 1. Journal Entry Suggestions
**Function:** `suggestJournalEntry(description, amount)`
**Purpose:** Suggests debit/credit accounts for journal entries
**Returns:**
```typescript
{
  success: boolean;
  suggestion: {
    debit: { account: string, amount: number };
    credit: { account: string, amount: number };
    reasoning: string;
  }
}
```
**Example:**
```typescript
const result = await suggestJournalEntry("Purchased office equipment", 5000);
// Returns: { debit: { account: "Equipment", amount: 5000 }, credit: { account: "Cash", amount: 5000 }, ... }
```

---

## Tax Module

### 1. Tax Deduction Suggestions
**Function:** `suggestTaxDeductions()`
**Purpose:** Analyzes expenses and suggests tax-deductible items
**Returns:**
```typescript
{
  success: boolean;
  suggestions: string; // Detailed analysis with estimated savings
}
```

---

## Products/Inventory Module

### 1. Demand Forecasting
**Function:** `forecastDemand(productId)`
**Purpose:** Forecasts product demand for next 3 months
**Returns:**
```typescript
{
  success: boolean;
  forecast: {
    forecast: Array<{ month: string, quantity: number }>;
    reorderPoint: number;
    confidence: "high" | "medium" | "low";
  }
}
```

### 2. Price Optimization
**Function:** `optimizePrice(productId, currentPrice)`
**Purpose:** Suggests optimal pricing based on sales history
**Returns:**
```typescript
{
  success: boolean;
  optimization: {
    suggestedPrice: number;
    expectedRevenue: number;
    reasoning: string;
  }
}
```

---

## CRM Module

### 1. Customer Segmentation
**Function:** `segmentCustomers()`
**Purpose:** Segments customers into groups (High-value, Regular, At-risk, New)
**Returns:**
```typescript
{
  success: boolean;
  segments: {
    segments: Array<{
      name: string;
      count: number;
      characteristics: string;
    }>
  }
}
```

### 2. Lead Scoring
**Function:** `scoreLeads(leadData)`
**Purpose:** Scores leads 0-100 with priority levels
**Input:**
```typescript
leadData: Array<{ name: string, company?: string, email?: string }>
```
**Returns:**
```typescript
{
  success: boolean;
  scores: {
    scores: Array<{
      name: string;
      score: number;
      priority: "high" | "medium" | "low";
      reasoning: string;
    }>
  }
}
```

---

## Projects Module

### 1. Project Budget Forecasting
**Function:** `forecastProjectBudget(projectName, estimatedHours, resources)`
**Purpose:** Forecasts project costs, timeline, and risks
**Returns:**
```typescript
{
  success: boolean;
  forecast: {
    estimatedCost: number;
    contingency: number;
    timeline: string;
    risks: string[];
  }
}
```

---

## Budgeting Module

### 1. Budget Suggestions
**Function:** `suggestBudget(category)`
**Purpose:** Suggests monthly budget based on historical spending
**Returns:**
```typescript
{
  success: boolean;
  budget: {
    suggested: number;
    min: number;
    max: number;
    reasoning: string;
  }
}
```

### 2. Variance Analysis
**Function:** `analyzeVariance(budgeted, actual, category)`
**Purpose:** Analyzes budget vs actual variance with recommendations
**Returns:**
```typescript
{
  success: boolean;
  analysis: string;
  variance: number; // Percentage
}
```

---

## AI Assistant (Dashboard)

### 1. Chat with AI
**Function:** `chatWithAI(message, conversationHistory?, conversationId?)`
**Purpose:** Financial assistant for accounting guidance
**Returns:**
```typescript
{
  success: boolean;
  message: string;
  followUpQuestions: string[];
  usage: object;
}
```

### 2. Financial Insights
**Function:** `getFinancialInsights()`
**Purpose:** Analyzes revenue, expenses, profit margins
**Returns:**
```typescript
{
  success: boolean;
  insights: string;
  metrics: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    profitMargin: string;
    overdueInvoices: number;
    totalOverdue: number;
  }
}
```

### 3. Smart Search
**Function:** `smartSearch(query)`
**Purpose:** Natural language search across invoices, expenses, customers, vendors
**Returns:**
```typescript
{
  success: boolean;
  intent: string;
  results: any[];
  response: string;
}
```

### 4. Financial Forecasting
**Function:** `forecastFinancials(months?)`
**Purpose:** Predicts future revenue/expenses
**Returns:**
```typescript
{
  success: boolean;
  forecast: Array<{ month: string, revenue: number, expenses: number, confidence: string }>;
  insights: string;
  trend: "growing" | "stable" | "declining";
  historical: any[];
}
```

### 5. Smart Reconciliation
**Function:** `smartReconcile(bankTransactions)`
**Purpose:** Matches bank transactions with invoices/expenses
**Returns:**
```typescript
{
  success: boolean;
  matches: Array<{
    transaction: any;
    match: { type: "expense" | "invoice", id: string };
    confidence: string;
  }>
}
```

---

## Implementation Notes

### Access Control
All AI features check for AI module access:
```typescript
if (!await checkModuleAccess(user.organizationId, "ai")) {
  return { success: false, error: "AI module is not enabled for your organization" };
}
```

### Authentication
All exported functions use `withAuth` wrapper for user authentication.

### Error Handling
All functions return a consistent response format:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### Usage in Components
```typescript
"use client";
import { suggestSalary } from "@/lib/actions/ai.action";

const handleSuggest = async () => {
  const result = await suggestSalary("Developer", 3, "Tech");
  if (result.success) {
    console.log(result.suggestion);
  } else {
    console.error(result.error);
  }
};
```
