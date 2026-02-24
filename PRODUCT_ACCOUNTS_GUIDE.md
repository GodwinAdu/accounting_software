# Product GL Accounts - Usage Guide

## Product Account Setup

When you create a product, you link 3 GL accounts:

```typescript
Product {
  salesAccountId: "4000"      // Revenue account (e.g., Sales Revenue)
  purchaseAccountId: "5000"   // COGS/Expense account (e.g., Cost of Goods Sold)
  inventoryAccountId: "1300"  // Asset account (e.g., Inventory)
}
```

## How Accounts Are Used

### 1. BUYING Products (Bills Module - Expenses Section)

**Location**: Expenses → Bills  
**Action**: Create Bill → Approve Bill

```
When you approve a bill with product items:

GL Entry:
  Debit: Inventory Account (1300)           [from product.inventoryAccountId]
  Credit: Accounts Payable (2000)

Stock: +10 units
```

**Example**: Buy 10 Laptops at GHS 2,000 each
```
Debit: Inventory (1300)           20,000
Credit: Accounts Payable (2000)   20,000

Laptop.currentStock: 0 → 10
```

---

### 2. SELLING Products (Sales Module - Sales Section)

**Location**: Sales → Invoices or Sales → Receipts  
**Action**: Create Invoice → Approve Invoice

```
When you approve an invoice with product items:

SALE ENTRY:
  Debit: Accounts Receivable (1200)
  Credit: Sales Account (4000)              [from product.salesAccountId]

COGS ENTRY (automatic):
  Debit: Purchase Account (5000)            [from product.purchaseAccountId]
  Credit: Inventory Account (1300)          [from product.inventoryAccountId]

Stock: -2 units
```

**Example**: Sell 2 Laptops at GHS 3,500 each
```
SALE:
  Debit: Receivables (1200)       7,000
  Credit: Sales Revenue (4000)    7,000

COGS:
  Debit: COGS (5000)              4,000  (2 × 2,000 cost)
  Credit: Inventory (1300)        4,000

Laptop.currentStock: 10 → 8

Gross Profit: 7,000 - 4,000 = 3,000
```

---

## Account Usage Summary

| Account | Used When | Module | Entry Type |
|---------|-----------|--------|------------|
| **salesAccountId** | Selling | Sales (Invoices/Receipts) | Credit (Revenue ↑) |
| **purchaseAccountId** | Selling | Sales (Invoices/Receipts) | Debit (COGS ↑) |
| **inventoryAccountId** | Buying | Expenses (Bills) | Debit (Asset ↑) |
| **inventoryAccountId** | Selling | Sales (Invoices/Receipts) | Credit (Asset ↓) |

---

## Complete Cycle Example

### Step 1: Buy Inventory (Bills Module)
```
Create Bill:
  Vendor: Tech Supplies
  Item: Laptop (productId linked)
  Qty: 10
  Price: GHS 2,000

Approve Bill:
  ✅ Debit: Inventory (1300)           20,000
  ✅ Credit: Accounts Payable (2000)   20,000
  ✅ Stock: 0 → 10
```

### Step 2: Sell Product (Sales Module)
```
Create Invoice:
  Customer: ABC Company
  Item: Laptop (productId linked)
  Qty: 2
  Price: GHS 3,500

Approve Invoice:
  ✅ Debit: Receivables (1200)         7,000
  ✅ Credit: Sales Revenue (4000)      7,000
  ✅ Debit: COGS (5000)                4,000
  ✅ Credit: Inventory (1300)          4,000
  ✅ Stock: 10 → 8
```

### Step 3: Financial Statements
```
Balance Sheet:
  Inventory: 16,000 (8 units × 2,000)
  Receivables: 7,000
  Payables: 20,000

Income Statement:
  Revenue: 7,000
  COGS: (4,000)
  Gross Profit: 3,000
  Margin: 42.86%
```

---

## Why This Design?

### ✅ Flexibility
- Different products can use different revenue accounts
- Example: "Product Sales" vs "Service Revenue"

### ✅ Accurate COGS
- System knows the cost price from purchase
- Auto-calculates COGS when selling

### ✅ Inventory Tracking
- Real-time stock levels
- Accurate inventory valuation

### ✅ Proper Accounting
- Double-entry bookkeeping
- Balanced journal entries
- Audit trail

---

## Default Accounts

If product accounts are not set, system uses defaults:

| Account Type | Default Account | Code |
|--------------|----------------|------|
| Sales | Sales Revenue | 4000 |
| Purchase (COGS) | Cost of Goods Sold | 5000 |
| Inventory | Inventory | 1300 |
| Payables | Accounts Payable | 2000 |
| Receivables | Accounts Receivable | 1200 |

---

## Key Takeaways

1. **Bills** (Expenses) = Buying inventory → Increases Inventory & Payables
2. **Invoices/Receipts** (Sales) = Selling products → Increases Revenue & COGS, Decreases Inventory
3. **Product accounts** are templates used by both modules
4. **salesAccountId** = Revenue when selling
5. **purchaseAccountId** = COGS when selling (not when buying!)
6. **inventoryAccountId** = Asset account for stock value

The system automatically handles all GL posting and stock updates! 🎯
