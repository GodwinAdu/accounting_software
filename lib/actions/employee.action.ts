"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Employee from "../models/employee.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createEmployee(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    await connectToDB();

    // Generate employee number
    const lastEmployee = await Employee.findOne({ organizationId: user.organizationId })
      .sort({ employeeNumber: -1 })
      .select("employeeNumber");

    let nextNumber = 1;
    if (lastEmployee?.employeeNumber) {
      const lastNum = parseInt(lastEmployee.employeeNumber.split("-")[1]);
      nextNumber = lastNum + 1;
    }
    const employeeNumber = `EMP-${String(nextNumber).padStart(6, "0")}`;

    // Create Employee record
    const employee = await Employee.create({
      userId: data.userId,
      organizationId: user.organizationId,
      employeeNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      department: data.department,
      position: data.position,
      employmentType: data.employmentType,
      hireDate: data.hireDate,
      salary: data.salary,
      paymentFrequency: data.paymentFrequency,
      bankDetails: data.bankDetails,
      taxInfo: data.taxInfo,
      status: data.status || "active",
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "employee",
      resourceId: String(employee._id),
      details: { after: employee },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(employee)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmployees(user: any) {
  try {
    await connectToDB();

    const employees = await Employee.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });
   

    return { success: true, data: JSON.parse(JSON.stringify(employees)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmployeeById(user: any, id: string) {
  try {
    await connectToDB();

    const employee = await Employee.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate("userId", "firstName lastName email phone");

    if (!employee) {
      return { error: "Employee not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(employee)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateEmployee(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    await connectToDB();

    const oldEmployee = await Employee.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldEmployee) {
      return { error: "Employee not found" };
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    ).populate("userId", "firstName lastName email phone");

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "employee",
      resourceId: String(id),
      details: { before: oldEmployee, after: employee },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(employee)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteEmployee(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    await connectToDB();

    const employee = await Employee.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!employee) {
      return { error: "Employee not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "employee",
      resourceId: String(id),
      details: { before: employee },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmployeeSummary(user: any) {
  try {
    await connectToDB();

    const employees = await Employee.find({
      organizationId: user.organizationId,
      del_flag: false,
    });

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

    return {
      success: true,
      data: { totalEmployees, activeEmployees, totalPayroll },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createEmployee = await withAuth(_createEmployee);
export const getEmployees = await withAuth(_getEmployees);
export const getEmployeeById = await withAuth(_getEmployeeById);
export const updateEmployee = await withAuth(_updateEmployee);
export const deleteEmployee = await withAuth(_deleteEmployee);
export const getEmployeeSummary = await withAuth(_getEmployeeSummary);
