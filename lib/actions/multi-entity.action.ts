"use server";

import { connectToDB } from "../connection/mongoose";
import Organization from "../models/organization.model";
import Invoice from "../models/invoice.model";
import JournalEntry from "../models/journal-entry.model";
import { withAuth } from "../helpers/auth";

async function _getMultiEntityData(user: any) {
  try {
    await connectToDB();

    const currentOrg = await Organization.findById(user.organizationId);
    if (!currentOrg) {
      return { error: "Organization not found" };
    }

    const allOrgs = await Organization.find({ 
      owner: currentOrg.owner, 
      del_flag: false, 
      isActive: true 
    }).lean();

    const orgIds = allOrgs.map(org => org._id);
    
    const invoices = await Invoice.find({ 
      organizationId: { $in: orgIds }, 
      del_flag: false 
    }).lean();
    
    const interCompanyEntries = await JournalEntry.find({ 
      organizationId: { $in: orgIds }, 
      entryType: "adjustment",
      del_flag: false 
    }).lean();

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const interCompanyThisMonth = interCompanyEntries.filter(
      e => new Date(e.entryDate) >= thisMonth
    ).length;
    
    const pendingEliminations = interCompanyEntries.filter(
      e => e.status === "draft"
    ).length;

    return {
      success: true,
      data: {
        entities: JSON.parse(JSON.stringify(allOrgs)),
        totalEntities: allOrgs.length,
        totalRevenue,
        interCompanyThisMonth,
        pendingEliminations,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getMultiEntityData = await withAuth(_getMultiEntityData);
