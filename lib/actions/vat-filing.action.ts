"use server";

import { connectToDB } from "../connection/mongoose";
import VATFiling from "../models/vat-filing.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createVATFiling(
  user: any,
  data: {
    filingPeriod: string;
    filingMonth: string;
    vatAmount: number;
    filedDate: Date;
    status: "filed" | "paid" | "overdue";
    graReferenceNumber?: string;
    journalEntryId?: string;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastFiling = await VATFiling.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .select("filingNumber");

    let nextNumber = 1;
    if (lastFiling?.filingNumber) {
      const lastNumber = parseInt(lastFiling.filingNumber.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const filingNumber = `VAT-${String(nextNumber).padStart(6, "0")}`;

    const filing = await VATFiling.create({
      organizationId: user.organizationId,
      filingNumber,
      ...data,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "vat_filing",
      resourceId: String(filing._id),
      details: { after: filing },
    });

    return { success: true, data: JSON.parse(JSON.stringify(filing)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getVATFilings(user: any) {
  try {
    await connectToDB();

    const filings = await VATFiling.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("journalEntryId", "entryNumber")
      .sort({ filedDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(filings)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getVATFilingById(user: any, id: string) {
  try {
    await connectToDB();

    const filing = await VATFiling.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate("journalEntryId", "entryNumber");

    if (!filing) return { error: "VAT filing not found" };

    return { success: true, data: JSON.parse(JSON.stringify(filing)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateVATFiling(
  user: any,
  id: string,
  data: {
    filingPeriod?: string;
    filingMonth?: string;
    vatAmount?: number;
    filedDate?: Date;
    status?: "filed" | "paid" | "overdue";
    graReferenceNumber?: string;
    journalEntryId?: string;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldFiling = await VATFiling.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldFiling) return { error: "VAT filing not found" };

    const filing = await VATFiling.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!filing) return { error: "VAT filing not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "vat_filing",
      resourceId: String(id),
      details: { before: oldFiling, after: filing },
    });

    return { success: true, data: JSON.parse(JSON.stringify(filing)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteVATFiling(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const filing = await VATFiling.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!filing) return { error: "VAT filing not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "vat_filing",
      resourceId: String(id),
      details: { before: filing },
    });

    return { success: true, message: "VAT filing deleted successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createVATFiling = await withAuth(_createVATFiling);
export const getVATFilings = await withAuth(_getVATFilings);
export const getVATFilingById = await withAuth(_getVATFilingById);
export const updateVATFiling = await withAuth(_updateVATFiling);
export const deleteVATFiling = await withAuth(_deleteVATFiling);
