# Audit Logging Implementation Guide

## Overview
This guide shows how to add audit logging to all action functions in the PayFlow application.

## Pattern to Follow

### 1. Import the logAudit helper
```typescript
import { logAudit } from "../helpers/audit";
```

### 2. Add audit logs after successful operations

#### CREATE Operations
```typescript
await logAudit({
    organizationId: String(user.organizationId),
    userId: String(user._id || user.id),
    action: "create",
    resource: "resource_name", // e.g., "invoice", "product", "customer"
    resourceId: String(newRecord._id),
    details: { after: newRecord },
});
```

#### UPDATE Operations
```typescript
// Fetch old data before update
const oldData = await Model.findById(id);

// Perform update
const newData = await Model.findByIdAndUpdate(id, updateData, { new: true });

// Log audit
await logAudit({
    organizationId: String(user.organizationId),
    userId: String(user._id || user.id),
    action: "update",
    resource: "resource_name",
    resourceId: String(id),
    details: { before: oldData, after: newData },
});
```

#### DELETE Operations
```typescript
// Fetch data before delete
const deletedData = await Model.findById(id);

// Perform delete
await Model.findByIdAndUpdate(id, { del_flag: true });

// Log audit
await logAudit({
    organizationId: String(user.organizationId),
    userId: String(user._id || user.id),
    action: "delete",
    resource: "resource_name",
    resourceId: String(id),
    details: { before: deletedData },
});
```

## Files to Update

### Core Modules
- [x] `lib/actions/employee.action.ts` - COMPLETED
- [ ] `lib/actions/user.action.ts`
- [ ] `lib/actions/role.action.ts`
- [ ] `lib/actions/department.action.ts`

### Banking Module
- [ ] `lib/actions/bank-account.action.ts`
- [ ] `lib/actions/bank-transaction.action.ts`
- [ ] `lib/actions/bank-reconciliation.action.ts`

### Sales Module
- [ ] `lib/actions/invoice.action.ts`
- [ ] `lib/actions/customer.action.ts`
- [ ] `lib/actions/estimate.action.ts`
- [ ] `lib/actions/payment.action.ts`

### Expenses Module
- [ ] `lib/actions/expense.action.ts`
- [ ] `lib/actions/bill.action.ts`
- [ ] `lib/actions/vendor.action.ts`
- [ ] `lib/actions/purchase-order.action.ts`

### Payroll Module
- [ ] `lib/actions/payroll.action.ts`
- [ ] `lib/actions/timesheet.action.ts`
- [ ] `lib/actions/leave.action.ts`
- [ ] `lib/actions/deduction.action.ts`

### Accounting Module
- [ ] `lib/actions/chart-of-accounts.action.ts`
- [ ] `lib/actions/journal-entry.action.ts`

### Tax Module
- [ ] `lib/actions/tax.action.ts`

### Products Module
- [ ] `lib/actions/product.action.ts`
- [ ] `lib/actions/inventory.action.ts`

## Resource Names Convention

Use lowercase, singular form with underscores:
- `employee`
- `user`
- `role`
- `department`
- `bank_account`
- `transaction`
- `invoice`
- `customer`
- `expense`
- `bill`
- `vendor`
- `product`
- `inventory`
- `payroll`
- `timesheet`
- `leave`
- `journal_entry`
- `tax_setting`

## Example: Complete Implementation

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Product from "../models/product.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createProduct(user: any, data: any) {
  try {
    await connectToDB();

    const product = await Product.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "product",
      resourceId: String(product._id),
      details: { after: product },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateProduct(user: any, id: string, data: any) {
  try {
    await connectToDB();

    const oldProduct = await Product.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldProduct) {
      return { error: "Product not found" };
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...data, modifiedBy: user._id },
      { new: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "product",
      resourceId: String(id),
      details: { before: oldProduct, after: product },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteProduct(user: any, id: string) {
  try {
    await connectToDB();

    const product = await Product.findByIdAndUpdate(
      id,
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!product) {
      return { error: "Product not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "product",
      resourceId: String(id),
      details: { before: product },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createProduct = await withAuth(_createProduct);
export const updateProduct = await withAuth(_updateProduct);
export const deleteProduct = await withAuth(_deleteProduct);
```

## Best Practices

1. **Always log after successful operations** - Don't log if the operation fails
2. **Include before/after data** - For updates, capture both old and new state
3. **Use consistent resource names** - Follow the naming convention
4. **Don't log sensitive data** - Avoid logging passwords, tokens, etc.
5. **Log at the right level** - CREATE/UPDATE/DELETE are essential, VIEW is optional
6. **Handle errors gracefully** - Audit logging failures shouldn't break the main operation

## Testing Audit Logs

After implementation, verify audit logs are working:

1. Go to Settings > Audit Logs
2. Perform a CREATE operation
3. Perform an UPDATE operation
4. Perform a DELETE operation
5. Check that all operations are logged with correct details

## Next Steps

1. Update all action files listed above
2. Test each module after adding audit logs
3. Verify audit log entries in the database
4. Check the Audit Logs UI displays correctly
