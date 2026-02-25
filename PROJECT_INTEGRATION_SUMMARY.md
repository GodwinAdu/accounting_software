# Project Integration - Complete Implementation

## What Was Done

### 1. Database Models Updated
- **Invoice Model**: Added `projectId` field to link invoices to projects
- **Expense Model**: Added `projectId` field to link expenses to projects

### 2. GL Posting Logic Enhanced
- **sales-accounting.ts**: 
  - Checks if invoice has `projectId`
  - Uses project's `revenueAccountId` if linked
  - Auto-updates project's `revenue` field when invoice is paid
  
- **expense-accounting.ts**:
  - Checks if expense has `projectId`
  - Uses project's `expenseAccountId` if linked
  - Auto-updates project's `actualCost` field when expense is paid

### 3. UI Components Created
- **ProjectSelector Component**: Reusable dropdown to select active projects
  - Shows project number and name
  - Displays project status
  - Allows "None" selection
  - Auto-loads active projects (planning, active, on_hold)

### 4. Forms Updated
- **Invoice Form**: Added project selector in Accounting section
- **Expense Form**: Added project selector in Accounting section

### 5. Server Actions
- **project-list.action.ts**: Fetches active projects for dropdowns

## How It Works

### Creating Invoice with Project Link
1. User creates invoice
2. In "Accounting (Optional)" section, selects a project
3. When invoice status → "sent" or "paid":
   - System posts to GL using project's revenue account (4100)
   - Project's `revenue` field increases automatically
   - Journal entry created with project reference

### Creating Expense with Project Link
1. User creates expense
2. In "Accounting (Optional)" section, selects a project
3. When expense status → "paid":
   - System posts to GL using project's expense account (6200)
   - Project's `actualCost` field increases automatically
   - Journal entry created with project reference

## User Flow

```
Invoice/Expense Form
    ↓
Accounting Section (Optional)
    ↓
Select Project (dropdown shows: PRJ-001 - Website Redesign)
    ↓
Save Invoice/Expense
    ↓
Mark as Paid/Sent
    ↓
Auto GL Posting:
  - Uses project accounts
  - Updates project revenue/cost
  - Creates journal entry
```

## Benefits

1. **Automatic Tracking**: Revenue and costs automatically tracked per project
2. **Accurate Profitability**: Real-time profit calculation (revenue - actualCost)
3. **Proper GL Posting**: Uses correct accounts based on project configuration
4. **Audit Trail**: All transactions linked to projects via journal entries
5. **Optional Feature**: Projects are optional - works without linking too

## Files Modified
- `lib/models/invoice.model.ts`
- `lib/models/expense.model.ts`
- `lib/helpers/sales-accounting.ts`
- `lib/helpers/expense-accounting.ts`
- `app/.../invoices/new/_components/invoice-form.tsx`
- `app/.../expenses/all/new/_components/expense-form.tsx`

## Files Created
- `lib/actions/project-list.action.ts`
- `components/selectors/project-selector.tsx`
- `PROJECT_ACCOUNTING_FLOW.md`
