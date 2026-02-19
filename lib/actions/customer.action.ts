"use server";

import { revalidatePath } from "next/cache";
import Customer from "@/lib/models/customer.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

// Create Customer
async function _createCustomer(
  user: User,
  data: any,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("customers_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create customers" };
    }

    await connectToDB();

    const customer = await Customer.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "customer",
      resourceId: String(customer._id),
      details: { after: customer },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error: any) {
    console.error("Create customer error:", error);
    return { error: error.message || "Failed to create customer" };
  }
}

export const createCustomer = await withAuth(_createCustomer);

// Get Customers
async function _getCustomers(user: User) {
  try {
    const hasPermission = await checkPermission("customers_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view customers" };
    }

    await connectToDB();

    const customers = await Customer.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(customers)) };
  } catch (error: any) {
    console.error("Get customers error:", error);
    return { error: error.message || "Failed to fetch customers" };
  }
}

export const getCustomers = await withAuth(_getCustomers);

// Get Customer by ID
async function _getCustomerById(user: User, customerId: string) {
  try {
    const hasPermission = await checkPermission("customers_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view customers" };
    }

    await connectToDB();

    const customer = await Customer.findOne({
      _id: customerId,
      organizationId: user.organizationId,
      del_flag: false,
    }).lean();

    if (!customer) {
      return { error: "Customer not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error: any) {
    console.error("Get customer error:", error);
    return { error: error.message || "Failed to fetch customer" };
  }
}

export const getCustomerById = await withAuth(_getCustomerById);

// Update Customer
async function _updateCustomer(
  user: User,
  customerId: string,
  data: any,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("customers_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update customers" };
    }

    await connectToDB();

    const oldCustomer = await Customer.findOne({
      _id: customerId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldCustomer) {
      return { error: "Customer not found" };
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: customerId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        ...data,
        modifiedBy: user._id,
        mod_flag: true,
      },
      { new: true }
    );

    if (!customer) {
      return { error: "Customer not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "customer",
      resourceId: String(customerId),
      details: { before: oldCustomer, after: customer },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error: any) {
    console.error("Update customer error:", error);
    return { error: error.message || "Failed to update customer" };
  }
}

export const updateCustomer = await withAuth(_updateCustomer);

// Delete Customer
async function _deleteCustomer(
  user: User,
  customerId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("customers_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete customers" };
    }

    await connectToDB();

    const customer = await Customer.findOneAndUpdate(
      {
        _id: customerId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        del_flag: true,
        deletedBy: user._id,
      },
      { new: true }
    );

    if (!customer) {
      return { error: "Customer not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "customer",
      resourceId: String(customerId),
      details: { before: customer },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete customer error:", error);
    return { error: error.message || "Failed to delete customer" };
  }
}

export const deleteCustomer = await withAuth(_deleteCustomer);
