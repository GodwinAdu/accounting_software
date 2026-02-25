# Project Accounting Flow

## Overview
Projects are tracking containers that automatically integrate with the General Ledger when invoices and expenses are linked to them.

## GL Posting Triggers

### Invoice → Project Revenue
**When**: Invoice status changes to "sent" or "paid"
**What happens**:
1. System checks if invoice has `projectId`
2. If yes, uses project's `revenueAccountId` (default: 4100 - Project Revenue)
3. Creates journal entry: Debit A/R, Credit Project Revenue
4. Updates project's `revenue` field automatically
5. Posts to General Ledger

**Example**:
```
Invoice #INV-001 for GHS 5,000 linked to "Website Redesign" project
Status: draft → paid
Result: 
- JE: DR Accounts Receivable 5,000 / CR Project Revenue 5,000
- Project revenue increases by GHS 5,000
```

### Expense → Project Cost
**When**: Expense status changes to "paid"
**What happens**:
1. System checks if expense has `projectId`
2. If yes, uses project's `expenseAccountId` (default: 6200 - Project Expenses)
3. Creates journal entry: Debit Project Expenses, Credit Cash/Bank
4. Updates project's `actualCost` field automatically
5. Posts to General Ledger

**Example**:
```
Expense #EXP-001 for GHS 500 linked to "Website Redesign" project
Status: pending → approved → paid
Result:
- JE: DR Project Expenses 500 / CR Cash 500
- Project actualCost increases by GHS 500
```

## Project Profitability
Calculated automatically:
```
Profit = revenue - actualCost
Margin = (profit / revenue) × 100
```

## Status Flow

### Invoice Statuses
- **draft**: No GL posting
- **sent**: Posts to GL (revenue recognized)
- **paid**: Posts to GL if not already posted
- **overdue**: No additional GL posting
- **cancelled**: No GL posting

### Expense Statuses
- **pending**: No GL posting
- **approved**: No GL posting (approval only)
- **paid**: Posts to GL (expense recognized)
- **rejected**: No GL posting

## Integration Points

### Current Implementation
✅ Invoices automatically post to project revenue when paid
✅ Expenses automatically post to project costs when paid
✅ Project accounts auto-created if not specified
✅ Project revenue/actualCost updated automatically

### Future Integration (Not Yet Implemented)
- Time tracking → billable hours → invoice generation
- Purchase orders → received → expense creation
- Payroll → project team costs → expense allocation

## Account Structure
```
4100 - Project Revenue (Revenue Account)
  ↓ Credits increase revenue
  
6200 - Project Expenses (Expense Account)
  ↓ Debits increase expenses
```

## Key Files
- `lib/models/invoice.model.ts` - Added projectId field
- `lib/models/expense.model.ts` - Added projectId field
- `lib/helpers/sales-accounting.ts` - Invoice GL posting with project integration
- `lib/helpers/expense-accounting.ts` - Expense GL posting with project integration
- `lib/actions/invoice.action.ts` - Auto-posts when status = sent/paid
- `lib/actions/expense.action.ts` - Auto-posts when status = paid
