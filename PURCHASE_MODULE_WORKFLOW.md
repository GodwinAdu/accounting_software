# Purchase Module - Complete Workflow

## Overview
The Purchase/Bills module handles buying inventory from vendors with automatic GL posting and stock updates.

## Complete Purchase Flow

### 1. Create Vendor
```
Action: Create vendor record
Result: Vendor profile created (no GL posting)
```

### 2. Create Bill (Draft)
```
Action: Create bill with line items
Items: Can link to products or be general expenses
Result: Bill saved as DRAFT (no GL posting, no stock update)
```

### 3. Approve Bill
```
Action: Change status from DRAFT → OPEN
GL Posting:
  For each product item:
    Debit: Inventory Account (1300)    [Asset ↑]
    Credit: Accounts Payable (2000)    [Liability ↑]
  
  For non-product items:
    Debit: Purchase/Expense Account    [Expense ↑]
    Credit: Accounts Payable (2000)    [Liability ↑]

Stock Update:
  - Product.currentStock += quantity
  - Uses product's inventoryAccountId or default

Result: 
  ✅ Journal entry created
  ✅ GL posted
  ✅ Inventory increased
  ✅ Accounts Payable increased
```

### 4. Pay Bill
```
Action: Record payment against bill
GL Posting:
  Debit: Accounts Payable (2000)     [Liability ↓]
  Credit: Cash (1000)                [Asset ↓]

Result:
  ✅ Bill.amountPaid updated
  ✅ Bill.balance reduced
  ✅ Status → PAID when fully paid
```

## Example: Buy 10 Laptops at GHS 2,000 each

### Step 1: Create Bill (Draft)
```
Bill #BILL-00001
Vendor: Tech Supplies Ltd
Date: 2024-01-15
Items:
  - Product: Laptop (SKU: LAP-001)
  - Quantity: 10
  - Unit Price: GHS 2,000
  - Amount: GHS 20,000
Total: GHS 20,000
Status: DRAFT

❌ No GL posting
❌ No stock update
```

### Step 2: Approve Bill
```
Status: DRAFT → OPEN

GL Entry (JE-BILL-00001):
  Debit: Inventory (1300)           20,000
  Credit: Accounts Payable (2000)   20,000

Stock Update:
  Laptop.currentStock: 0 → 10

Balance Sheet Impact:
  Assets (Inventory): +20,000
  Liabilities (Payable): +20,000
```

### Step 3: Pay Bill (Partial - GHS 10,000)
```
GL Entry (JE-BP-00001):
  Debit: Accounts Payable (2000)    10,000
  Credit: Cash (1000)               10,000

Bill Status:
  Amount Paid: 10,000
  Balance: 10,000
  Status: OPEN

Balance Sheet Impact:
  Assets (Cash): -10,000
  Liabilities (Payable): -10,000
```

### Step 4: Pay Remaining Balance (GHS 10,000)
```
GL Entry (JE-BP-00002):
  Debit: Accounts Payable (2000)    10,000
  Credit: Cash (1000)               10,000

Bill Status:
  Amount Paid: 20,000
  Balance: 0
  Status: PAID

Balance Sheet Impact:
  Assets (Cash): -10,000
  Liabilities (Payable): -10,000
```

## When Customer Buys 2 Laptops at GHS 3,500 each

### Sale Entry (from existing sales module)
```
GL Entry:
  Debit: Cash/Receivables (1200)    7,000
  Credit: Sales Revenue (4000)      7,000

COGS Entry (automatic):
  Debit: COGS/Purchase Account      4,000  (2 × 2,000)
  Credit: Inventory (1300)          4,000

Stock Update:
  Laptop.currentStock: 10 → 8

P&L Impact:
  Revenue: +7,000
  COGS: -4,000
  Gross Profit: 3,000
```

## Key Features

### ✅ Automatic GL Posting
- Bills post to GL when approved (not when created)
- Payments reduce Accounts Payable
- All entries balanced and audited

### ✅ Inventory Integration
- Product items auto-update stock
- Uses product's linked accounts
- Falls back to default accounts

### ✅ Vendor Management
- Track multiple vendors
- Payment terms
- Credit limits
- Contact info

### ✅ Flexible Items
- Link to products (updates inventory)
- General expenses (no inventory)
- Mixed items in one bill

## Account Linking Priority

1. **Product-specific accounts** (from product.inventoryAccountId)
2. **Bill-level accounts** (from bill.expenseAccountId)
3. **Default accounts** (auto-created if missing)

## Status Flow

```
DRAFT → OPEN → PAID
  ↓       ↓
CANCELLED OVERDUE
```

- **DRAFT**: Editable, no GL posting
- **OPEN**: Approved, GL posted, awaiting payment
- **PAID**: Fully paid
- **OVERDUE**: Past due date with balance
- **CANCELLED**: Voided (requires reversal entry)

## Files Created

### Backend
- ✅ `lib/models/bill.model.ts` - Enhanced with productId
- ✅ `lib/helpers/purchase-accounting.ts` - GL posting logic
- ✅ `lib/actions/bill.action.ts` - CRUD + approve + payment
- ✅ `lib/actions/vendor.action.ts` - Vendor management

### Next Steps (UI)
- Create bills list page
- Create bill form
- Create vendor list page
- Create vendor form
- Add to navigation menu

## API Functions

### Bills
- `createBill(data, path)` - Create draft bill
- `getBills()` - List all bills
- `getBillById(billId)` - Get bill details
- `updateBill(billId, data, path)` - Update draft bill
- `deleteBill(billId, path)` - Soft delete
- `approveBill(billId, path)` - Approve & post to GL
- `recordBillPayment(billId, paymentData, path)` - Record payment

### Vendors
- `createVendor(data, path)` - Create vendor
- `getVendors()` - List all vendors
- `getVendorById(vendorId)` - Get vendor details
- `updateVendor(vendorId, data, path)` - Update vendor
- `deleteVendor(vendorId, path)` - Soft delete

## Integration with Existing Modules

### Products Module
- Bills reference products via `items.productId`
- Auto-updates `product.currentStock`
- Uses `product.inventoryAccountId` for GL posting

### Sales Module
- When selling, COGS uses product cost
- Inventory reduces automatically
- Complete purchase → sale cycle tracked

### Accounting Module
- All transactions post to General Ledger
- Journal entries auto-created
- Account balances auto-updated
- Audit trail maintained
