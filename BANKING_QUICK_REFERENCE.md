# Banking Module - Quick Reference Guide

## 🚀 Quick Start

### Access the Banking Module
Navigate to: `/{organizationId}/dashboard/{userId}/banking/*`

### Available Routes
- `/banking/accounts` - Manage bank accounts
- `/banking/transactions` - View and create transactions
- `/banking/reconciliation` - Reconcile bank statements
- `/banking/rules` - Set up automation rules
- `/banking/transfers` - Transfer between accounts
- `/banking/feeds` - Import bank feeds
- `/banking/forecast` - View cash flow forecast

---

## 📦 Models & Schemas

### BankAccount
```typescript
{
  accountNumber: string
  accountName: string
  bankName: string
  accountType: "checking" | "savings" | "credit-card" | "money-market" | "other"
  currency: string (default: "GHS")
  currentBalance: number
  openingBalance: number
  openingBalanceDate: Date
  isActive: boolean
  isPrimary: boolean
}
```

### BankTransaction
```typescript
{
  transactionNumber: string (auto: BTX-XXXXXX)
  bankAccountId: ObjectId
  transactionDate: Date
  transactionType: "deposit" | "withdrawal" | "transfer" | "fee" | "interest" | "other"
  amount: number
  description: string
  isReconciled: boolean
}
```

### BankTransfer
```typescript
{
  transferNumber: string (auto: TRF-XXXXXX)
  fromAccountId: ObjectId
  toAccountId: ObjectId
  amount: number
  transferDate: Date
  status: "pending" | "completed" | "cancelled"
}
```

### BankReconciliation
```typescript
{
  reconciliationNumber: string (auto: REC-XXXXXX)
  bankAccountId: ObjectId
  statementDate: Date
  statementBalance: number
  bookBalance: number
  difference: number
  status: "in-progress" | "completed" | "cancelled"
}
```

### BankRule
```typescript
{
  name: string
  condition: "contains" | "starts-with" | "ends-with" | "equals" | "amount-greater" | "amount-less"
  value: string
  category: string
  action: "categorize" | "tag" | "flag"
  status: "active" | "inactive"
}
```

---

## 🔧 Server Actions

### Bank Accounts
```typescript
import { 
  createBankAccount, 
  getBankAccounts, 
  updateBankAccount, 
  deleteBankAccount 
} from "@/lib/actions/bank-account.action";

// Create
await createBankAccount({
  bankName: "GCB Bank",
  accountName: "Business Account",
  accountNumber: "1234567890",
  accountType: "checking",
  openingBalance: 50000,
  openingBalanceDate: new Date(),
});

// Get all
const { data } = await getBankAccounts();

// Update
await updateBankAccount(id, { accountName: "New Name" });

// Delete
await deleteBankAccount(id);
```

### Bank Transactions
```typescript
import { 
  createBankTransaction, 
  getBankTransactions, 
  reconcileBankTransaction 
} from "@/lib/actions/bank-transaction.action";

// Create
await createBankTransaction({
  bankAccountId: "account_id",
  transactionDate: new Date(),
  transactionType: "deposit",
  amount: 5000,
  description: "Payment received",
});

// Get all
const { data } = await getBankTransactions();

// Reconcile
await reconcileBankTransaction(transactionId);
```

### Bank Transfers
```typescript
import { 
  createBankTransfer, 
  getBankTransfers, 
  deleteBankTransfer 
} from "@/lib/actions/bank-transfer.action";

// Create
await createBankTransfer({
  fromAccountId: "account1_id",
  toAccountId: "account2_id",
  amount: 10000,
  transferDate: new Date(),
  notes: "Monthly transfer",
});

// Get all
const { data } = await getBankTransfers();

// Delete (reverses balances)
await deleteBankTransfer(transferId);
```

### Bank Reconciliation
```typescript
import { 
  createBankReconciliation, 
  completeBankReconciliation, 
  getUnreconciledTransactions 
} from "@/lib/actions/bank-reconciliation.action";

// Start
await createBankReconciliation({
  bankAccountId: "account_id",
  statementDate: new Date(),
  statementBalance: 75000,
});

// Complete
await completeBankReconciliation(reconciliationId, [txId1, txId2]);

// Get unreconciled
const { data } = await getUnreconciledTransactions(accountId);
```

### Bank Rules
```typescript
import { 
  createBankRule, 
  getBankRules, 
  updateBankRule 
} from "@/lib/actions/bank-rule.action";

// Create
await createBankRule({
  name: "Salary Payments",
  condition: "contains",
  value: "SALARY",
  category: "Payroll",
  action: "categorize",
  status: "active",
}, path);

// Get all
const { data } = await getBankRules();
```

### Cash Forecast
```typescript
import { getCashForecast } from "@/lib/actions/cash-forecast.action";

const { data } = await getCashForecast();
// Returns: currentBalance, forecast30, forecast60, forecast90, projections
```

---

## 🎨 UI Components

### Dialogs
```typescript
// Add Bank Account
<AddBankAccountDialog open={open} onOpenChange={setOpen} />

// Add Transaction
<AddTransactionDialog open={open} onOpenChange={setOpen} accounts={accounts} />

// Transfer Funds
<TransferDialog open={open} onOpenChange={setOpen} accounts={accounts} />

// Start Reconciliation
<StartReconciliationDialog open={open} onOpenChange={setOpen} accounts={accounts} />

// Bank Rule
<BankRuleDialog open={open} onOpenChange={setOpen} rule={rule} />
```

### Lists
```typescript
// Bank Accounts
<BankAccountsList 
  organizationId={orgId} 
  userId={userId} 
  accounts={accounts} 
  summary={summary} 
/>

// Transactions
<TransactionsList 
  organizationId={orgId} 
  userId={userId} 
  transactions={transactions} 
  accounts={accounts} 
/>

// Transfers
<TransfersList 
  accounts={accounts} 
  transfers={transfers} 
  hasCreatePermission={true} 
/>

// Rules
<BankRulesList rules={rules} hasCreatePermission={true} />

// Reconciliation
<ReconciliationTool 
  organizationId={orgId} 
  userId={userId} 
  reconciliations={reconciliations} 
  accounts={accounts} 
/>
```

---

## 🔐 Permissions

```typescript
// Check permissions
import { checkPermission } from "@/lib/helpers/check-permission";

await checkPermission("banking_view");
await checkPermission("banking_create");
await checkPermission("banking_update");
await checkPermission("banking_delete");
await checkPermission("bankRules_view");
await checkPermission("bankTransfers_create");
await checkPermission("cashForecast_view");
```

---

## 🧪 Testing Examples

### Test Bank Account Creation
```typescript
const result = await createBankAccount({
  bankName: "Test Bank",
  accountName: "Test Account",
  accountNumber: "TEST123",
  accountType: "checking",
  currency: "GHS",
  openingBalance: 10000,
  openingBalanceDate: new Date(),
  isPrimary: true,
});

expect(result.success).toBe(true);
expect(result.data.currentBalance).toBe(10000);
```

### Test Transaction with Balance Update
```typescript
const account = await createBankAccount({ /* ... */ });

const transaction = await createBankTransaction({
  bankAccountId: account.data._id,
  transactionType: "deposit",
  amount: 5000,
  transactionDate: new Date(),
  description: "Test deposit",
});

const updatedAccount = await getBankAccountById(account.data._id);
expect(updatedAccount.data.currentBalance).toBe(15000);
```

### Test Transfer Between Accounts
```typescript
const account1 = await createBankAccount({ openingBalance: 20000 });
const account2 = await createBankAccount({ openingBalance: 5000 });

const transfer = await createBankTransfer({
  fromAccountId: account1.data._id,
  toAccountId: account2.data._id,
  amount: 3000,
  transferDate: new Date(),
});

const acc1 = await getBankAccountById(account1.data._id);
const acc2 = await getBankAccountById(account2.data._id);

expect(acc1.data.currentBalance).toBe(17000);
expect(acc2.data.currentBalance).toBe(8000);
```

---

## 📊 Common Queries

### Get Total Balance Across All Accounts
```typescript
const { data } = await getBankAccountsSummary();
console.log(data.totalBalance);
```

### Get Unreconciled Transactions
```typescript
const { data } = await getUnreconciledTransactions(accountId);
const unreconciledTotal = data.reduce((sum, tx) => sum + tx.amount, 0);
```

### Get Recent Transactions
```typescript
const { data } = await getBankTransactions();
const recent = data.slice(0, 10); // Last 10 transactions
```

### Get Active Bank Accounts
```typescript
const { data } = await getBankAccounts();
const active = data.filter(acc => acc.isActive);
```

---

## 🐛 Common Issues & Solutions

### Issue: Balance not updating
```typescript
// Ensure transaction type is correct
transactionType: "deposit" // increases balance
transactionType: "withdrawal" // decreases balance
```

### Issue: Transfer validation fails
```typescript
// Check: Different accounts
if (fromAccountId === toAccountId) throw Error();

// Check: Sufficient balance
if (fromAccount.currentBalance < amount) throw Error();
```

### Issue: Reconciliation difference
```typescript
// Calculate manually
const selectedTotal = selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
const difference = statementBalance - bookBalance;
```

---

## 📈 Best Practices

1. **Always validate balances** before transfers
2. **Use transactions** for all balance changes
3. **Reconcile regularly** (monthly recommended)
4. **Set up rules** for common transactions
5. **Monitor forecasts** to avoid cash shortages
6. **Audit logs** for compliance tracking
7. **Soft delete** to maintain history
8. **Permission checks** on all operations

---

## 🔗 Related Modules

- **Chart of Accounts**: Bank accounts link to GL accounts
- **Journal Entries**: Transactions create accounting entries
- **Invoices**: Expected inflows for forecasting
- **Bills**: Expected outflows for forecasting
- **Audit Logs**: All operations tracked

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review `BANKING_MODULE_COMPLETE.md`
3. Check model/action files
4. Review component implementations

---

**Quick Links**:
- Models: `lib/models/bank-*.model.ts`
- Actions: `lib/actions/bank-*.action.ts`
- Pages: `app/.../banking/*/page.tsx`
- Components: `app/.../banking/*/_components/`

---

**Status**: ✅ Production Ready
**Last Updated**: January 2025
