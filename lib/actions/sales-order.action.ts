"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import SalesOrder from "../models/sales-order.model";
import Product from "../models/product.model";
import JournalEntry from "../models/journal-entry.model";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createSalesOrder(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastOrder = await SalesOrder.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .lean();
    
    const orderNumber = data.orderNumber || `SO-${String((lastOrder ? parseInt(lastOrder.orderNumber.split('-')[1]) : 0) + 1).padStart(5, '0')}`;

    const salesOrder = await SalesOrder.create({
      ...data,
      orderNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      balance: data.total,
      mod_flag: false,
      del_flag: false
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "create",
      resource: "sales_order",
      resourceId: String(salesOrder._id),
      details: { after: salesOrder },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(salesOrder)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getSalesOrders(user: User) {
  try {
    await connectToDB();

    const orders = await SalesOrder.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("customerId", "name email company")
      .populate("items.productId", "name sku")
      .sort({ orderDate: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getSalesOrderById(user: User, orderId: string) {
  try {
    await connectToDB();

    const order = await SalesOrder.findOne({
      _id: orderId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("customerId", "name email company phone")
      .populate("items.productId", "name sku currentStock")
      .lean();

    if (!order) {
      return { error: "Sales order not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateSalesOrder(user: User, orderId: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldOrder = await SalesOrder.findOne({
      _id: orderId,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldOrder) {
      return { error: "Sales order not found" };
    }

    if (oldOrder.status === "delivered" || oldOrder.status === "paid") {
      return { error: "Cannot update delivered or paid orders" };
    }

    const order = await SalesOrder.findOneAndUpdate(
      { _id: orderId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "update",
      resource: "sales_order",
      resourceId: String(orderId),
      details: { before: oldOrder, after: order },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteSalesOrder(user: User, orderId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const order = await SalesOrder.findOneAndUpdate(
      { _id: orderId, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!order) {
      return { error: "Sales order not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "delete",
      resource: "sales_order",
      resourceId: String(orderId),
      details: { before: order },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _confirmSalesOrder(user: User, orderId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const order = await SalesOrder.findOne({
      _id: orderId,
      organizationId: user.organizationId,
      del_flag: false
    }).populate("items.productId");

    if (!order) {
      return { error: "Sales order not found" };
    }

    if (order.status !== "draft") {
      return { error: "Only draft orders can be confirmed" };
    }

    // Check stock availability
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product && product.trackInventory && product.currentStock < item.quantity) {
        return { error: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Required: ${item.quantity}` };
      }
    }

    // Post to GL and reduce inventory
    const lineItems = [];
    
    // Use order-level accounts or defaults
    const receivableAccount = order.receivableAccountId || await getDefaultAccount(order.organizationId, "asset", order.amountPaid > 0 ? "Cash" : "Accounts Receivable", String(user._id));
    const revenueAccount = order.revenueAccountId || await getDefaultAccount(order.organizationId, "revenue", "Sales Revenue", String(user._id));
    const cogsAccount = await getDefaultAccount(order.organizationId, "expense", "Cost of Goods Sold", String(user._id));
    const inventoryAccount = await getDefaultAccount(order.organizationId, "asset", "Inventory", String(user._id));
    const taxAccount = order.taxAccountId || await getDefaultAccount(order.organizationId, "liability", "VAT Payable", String(user._id));
    
    // Debit: Cash/Receivables
    lineItems.push({
      accountId: receivableAccount,
      description: `Sales Order ${order.orderNumber}`,
      debit: order.total,
      credit: 0
    });

    // Credit: Revenue
    lineItems.push({
      accountId: revenueAccount,
      description: `Sales Order ${order.orderNumber}`,
      debit: 0,
      credit: order.subtotal
    });

    // Process each product for COGS and inventory
    let totalCOGS = 0;
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const cogsAmount = product.costPrice * item.quantity;
        totalCOGS += cogsAmount;

        // Reduce stock
        if (product.trackInventory) {
          product.currentStock -= item.quantity;
          await product.save();
        }
      }
    }

    // Debit: COGS
    if (totalCOGS > 0) {
      lineItems.push({
        accountId: cogsAccount,
        description: `COGS for ${order.orderNumber}`,
        debit: totalCOGS,
        credit: 0
      });

      // Credit: Inventory
      lineItems.push({
        accountId: inventoryAccount,
        description: `Inventory sold - ${order.orderNumber}`,
        debit: 0,
        credit: totalCOGS
      });
    }

    // Tax if applicable
    if (order.taxAmount > 0) {
      lineItems.push({
        accountId: taxAccount,
        description: `VAT on ${order.orderNumber}`,
        debit: 0,
        credit: order.taxAmount
      });
    }

    // Calculate totals
    const totalDebit = lineItems.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = lineItems.reduce((sum, item) => sum + item.credit, 0);

    // Create Journal Entry
    const journalEntry = await JournalEntry.create({
      organizationId: order.organizationId,
      entryNumber: `JE-SO-${order.orderNumber}`,
      entryDate: order.orderDate,
      entryType: "automated",
      referenceType: "sales_order",
      referenceId: orderId,
      referenceNumber: order.orderNumber,
      description: `Sales Order ${order.orderNumber}`,
      lineItems,
      totalDebit,
      totalCredit,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: user._id,
      createdBy: user._id,
      del_flag: false,
      mod_flag: 0
    });

    // Post to GL
    const fiscalYear = new Date(order.orderDate).getFullYear();
    const fiscalPeriod = new Date(order.orderDate).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: order.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: order.orderDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "sales_order",
        referenceId: orderId,
        referenceNumber: order.orderNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    // Update order status
    order.status = "confirmed";
    order.modifiedBy = user._id;
    order.mod_flag = true;
    await order.save();

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "confirm",
      resource: "sales_order",
      resourceId: String(orderId),
      details: { status: "confirmed", journalEntryId: journalEntry._id },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function getDefaultAccount(organizationId: any, accountType: string, accountName: string, userId: string) {
  let account = await Account.findOne({
    organizationId,
    accountType,
    accountName: { $regex: accountName, $options: "i" },
    del_flag: false,
    isActive: true
  }).lean();
  
  if (!account) {
    const accountCodeMap: Record<string, number> = {
      "Sales Revenue": 4000,
      "Accounts Receivable": 1200,
      "Cash": 1000,
      "Cost of Goods Sold": 5000,
      "Inventory": 1300,
      "VAT Payable": 2100,
    };

    const newAccount = await Account.create({
      organizationId,
      accountCode: accountCodeMap[accountName]?.toString() || "9999",
      accountName,
      accountType,
      accountSubType: accountType === "revenue" ? "Sales Revenue" : 
                      accountType === "asset" ? "Current Asset" : 
                      accountType === "expense" ? "Cost of Goods Sold" :
                      "Current Liability",
      level: 0,
      isParent: false,
      isActive: true,
      isSystemAccount: true,
      allowManualJournal: true,
      currentBalance: 0,
      debitBalance: 0,
      creditBalance: 0,
      del_flag: false,
      createdBy: userId,
    });
    
    return newAccount._id;
  }
  
  return account._id;
}

async function updateAccountBalance(accountId: any, debit: number, credit: number) {
  const account = await Account.findById(accountId);
  if (!account) return;

  account.debitBalance += debit;
  account.creditBalance += credit;

  if (["asset", "expense"].includes(account.accountType)) {
    account.currentBalance = account.debitBalance - account.creditBalance;
  } else {
    account.currentBalance = account.creditBalance - account.debitBalance;
  }

  await account.save();
}

export const createSalesOrder = await withAuth(_createSalesOrder);
export const getSalesOrders = await withAuth(_getSalesOrders);
export const getSalesOrderById = await withAuth(_getSalesOrderById);
export const updateSalesOrder = await withAuth(_updateSalesOrder);
export const deleteSalesOrder = await withAuth(_deleteSalesOrder);
export const confirmSalesOrder = await withAuth(_confirmSalesOrder);
