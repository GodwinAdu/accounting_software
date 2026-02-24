# Sales & Purchase Module Structure

## Overview
Clean separation between product sales and service/general invoicing.

## Module Breakdown

### 1. **Sales Orders** (NEW - Product Sales Only)
**Location**: Products → Sales Orders  
**Purpose**: Sell physical products with inventory tracking  
**Features**:
- Product selection only
- Auto-uses product GL accounts (salesAccountId, cogsAccountId, inventoryAccountId)
- Auto-reduces inventory
- Posts COGS automatically
- Tracks stock levels

**GL Posting on Confirm**:
```
Debit: Cash/Receivables
Credit: Sales Account (from product)

Debit: COGS Account (from product)
Credit: Inventory Account (from product)

Stock: Reduces automatically
```

**Status Flow**: Draft → Confirmed → Delivered → Paid

---

### 2. **Invoices** (Existing - Services/General)
**Location**: Sales → Invoices  
**Purpose**: Bill for services, consulting, subscriptions, etc.  
**Features**:
- Free-form line items (no product link)
- Uses invoice-level GL accounts
- NO inventory tracking
- NO COGS posting

**GL Posting**:
```
Debit: Accounts Receivable
Credit: Revenue Account (from invoice)
Credit: Tax Account (if applicable)

NO COGS
NO Inventory changes
```

**Use Cases**:
- Consulting services
- Subscriptions
- Professional fees
- Custom charges

---

### 3. **Receipts** (Existing - Cash Sales)
**Location**: Sales → Receipts  
**Purpose**: Record immediate cash payments  
**Features**:
- Free-form line items
- Immediate payment
- NO inventory tracking
- NO COGS posting

**GL Posting**:
```
Debit: Cash
Credit: Revenue Account

NO COGS
NO Inventory changes
```

**Use Cases**:
- Cash sales (non-product)
- Service payments
- Deposits

---

### 4. **Bills** (Existing - Purchase Inventory)
**Location**: Expenses → Bills  
**Purpose**: Buy inventory from vendors  
**Features**:
- Product selection
- Increases inventory
- Uses product inventory account
- Tracks payables

**GL Posting on Approve**:
```
Debit: Inventory Account (from product)
Credit: Accounts Payable

Stock: Increases automatically
```

**Status Flow**: Draft → Open → Paid

---

## Complete Product Lifecycle

### Step 1: Buy Inventory (Bills)
```
Create Bill:
  Vendor: Tech Supplies
  Product: Laptop
  Qty: 10
  Cost: GHS 2,000

Approve Bill:
  Debit: Inventory (1300)           20,000
  Credit: Accounts Payable (2000)   20,000
  Stock: 0 → 10
```

### Step 2: Sell Product (Sales Orders)
```
Create Sales Order:
  Customer: ABC Company
  Product: Laptop
  Qty: 2
  Price: GHS 3,500

Confirm Sales Order:
  Debit: Receivables (1200)         7,000
  Credit: Sales Revenue (4000)      7,000
  Debit: COGS (5000)                4,000
  Credit: Inventory (1300)          4,000
  Stock: 10 → 8
```

### Step 3: Financial Impact
```
Balance Sheet:
  Inventory: 16,000 (8 × 2,000)
  Receivables: 7,000
  Payables: 20,000

Income Statement:
  Revenue: 7,000
  COGS: (4,000)
  Gross Profit: 3,000
```

---

## When to Use What

| Module | Use For | Inventory | COGS | Accounts |
|--------|---------|-----------|------|----------|
| **Sales Orders** | Selling products | ✅ Reduces | ✅ Posts | Product accounts |
| **Invoices** | Services/consulting | ❌ No | ❌ No | Invoice accounts |
| **Receipts** | Cash payments | ❌ No | ❌ No | Receipt accounts |
| **Bills** | Buying inventory | ✅ Increases | ❌ No | Product inventory account |

---

## Key Benefits

### ✅ Clear Separation
- Product sales = Sales Orders
- Service sales = Invoices
- No confusion

### ✅ Accurate Inventory
- Only Sales Orders affect stock
- Invoices don't touch inventory
- Clean tracking

### ✅ Proper COGS
- Only Sales Orders post COGS
- Invoices are revenue-only
- Correct P&L

### ✅ Flexible Accounting
- Products use their own accounts
- Services use invoice accounts
- No conflicts

---

## Files Created

### Backend
- ✅ `lib/models/sales-order.model.ts` - Sales order model
- ✅ `lib/actions/sales-order.action.ts` - CRUD + confirm with GL posting
- ✅ `lib/helpers/sales-accounting.ts` - Reverted (no COGS for invoices/receipts)
- ✅ `lib/actions/bill.action.ts` - Purchase bills (unchanged)
- ✅ `lib/helpers/purchase-accounting.ts` - Bill GL posting (unchanged)

### Next Steps (UI)
- Create Sales Orders list page
- Create Sales Order form with product selector
- Add to navigation menu

---

## Summary

**Before**: Invoices tried to do everything (confusing)  
**After**: Clean separation
- **Sales Orders** = Product sales (inventory + COGS)
- **Invoices** = Service sales (revenue only)
- **Bills** = Buy inventory

This matches how professional systems like QuickBooks and Xero separate product vs service sales! 🎯
