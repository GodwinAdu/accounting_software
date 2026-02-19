"use server";

import { connectToDB } from "../connection/mongoose";
import { withAuth } from "../helpers/auth";

async function _getContractorTaxCertificates(user: any, year: number) {
  try {
    await connectToDB();

    const Bill = (await import("../models/bill.model")).default;
    const Vendor = (await import("../models/vendor.model")).default;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const bills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false,
      billDate: { $gte: startDate, $lte: endDate },
    }).populate("vendorId");

    const vendorMap = new Map();

    bills.forEach((bill) => {
      const vendorId = bill.vendorId._id.toString();
      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, {
          vendorId: bill.vendorId._id,
          contractor: bill.vendorId.name,
          tin: bill.vendorId.taxId || "N/A",
          year: year.toString(),
          totalPayments: 0,
          whtDeducted: 0,
          status: "generated",
        });
      }
      const vendor = vendorMap.get(vendorId);
      vendor.totalPayments += bill.paidAmount;
      vendor.whtDeducted += bill.withholdingTax || 0;
    });

    return {
      success: true,
      data: Array.from(vendorMap.values()),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmployeeTaxCertificates(user: any, year: number) {
  try {
    await connectToDB();

    const PayrollRun = (await import("../models/payroll-run.model")).default;
    const Employee = (await import("../models/employee.model")).default;
    const User = (await import("../models/user.model")).default;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const payrollRuns = await PayrollRun.find({
      organizationId: user.organizationId,
      del_flag: false,
      startDate: { $gte: startDate, $lte: endDate },
      status: "completed",
    }).populate({
      path: "employeePayrolls.employeeId",
      populate: { path: "userId" },
    });

    const employeeMap = new Map();

    for (const run of payrollRuns) {
      for (const empPayroll of run.employeePayrolls) {
        const employee = empPayroll.employeeId;
        if (!employee || !employee.userId) continue;

        const empId = employee._id.toString();
        if (!employeeMap.has(empId)) {
          employeeMap.set(empId, {
            employeeId: employee.employeeNumber,
            employee: `${employee.userId.firstName} ${employee.userId.lastName}`,
            year: year.toString(),
            grossPay: 0,
            taxPaid: 0,
            ssnit: 0,
            status: "generated",
          });
        }
        const emp = employeeMap.get(empId);
        emp.grossPay += empPayroll.grossPay;
        emp.taxPaid += empPayroll.incomeTax;
        emp.ssnit += empPayroll.ssnitEmployee;
      }
    }

    return {
      success: true,
      data: Array.from(employeeMap.values()),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getContractorTaxCertificates = await withAuth(_getContractorTaxCertificates);
export const getEmployeeTaxCertificates = await withAuth(_getEmployeeTaxCertificates);
