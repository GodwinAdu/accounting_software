"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Project from "@/lib/models/project.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";
import { revalidatePath } from "next/cache";
import Account from "../models/account.model";

async function _createProject(user: any, data: any, pathname: string) {
  try {
    if(!user) throw new Error("User not found");

  const hasPermission = await checkPermission("projects_create");
  
  if (!hasPermission) return { error: "Permission denied" };

    await connectToDB();


    if (!data.revenueAccountId) {
      let revenueAccount = await Account.findOne({
        organizationId: user.organizationId,
        accountCode: "4100",
        del_flag: false,
      });

      if (!revenueAccount) {
        revenueAccount = await Account.create({
          organizationId: user.organizationId,
          accountCode: "4100",
          accountName: "Project Revenue",
          accountType: "revenue",
          accountSubType: "operating_revenue",
          level: 0,
          currentBalance: 0,
          debitBalance: 0,
          creditBalance: 0,
          isActive: true,
          isSystemAccount: false,
          allowManualJournal: true,
          reconciliationEnabled: false,
          del_flag: false,
          createdBy: user._id,
          mod_flag: 0,
        });
      }
      data.revenueAccountId = revenueAccount._id;
    }

    if (!data.expenseAccountId) {
      let expenseAccount = await Account.findOne({
        organizationId: user.organizationId,
        accountCode: "6200",
        del_flag: false,
      });

      if (!expenseAccount) {
        expenseAccount = await Account.create({
          organizationId: user.organizationId,
          accountCode: "6200",
          accountName: "Project Expenses",
          accountType: "expense",
          accountSubType: "operating_expenses",
          level: 0,
          currentBalance: 0,
          debitBalance: 0,
          creditBalance: 0,
          isActive: true,
          isSystemAccount: false,
          allowManualJournal: true,
          reconciliationEnabled: false,
          del_flag: false,
          createdBy: user._id,
          mod_flag: 0,
        });
      }
      data.expenseAccountId = expenseAccount._id;
    }

    const project = await Project.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
      actualCost: 0,
      revenue: 0,
    });

    revalidatePath(pathname);
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createProject = await withAuth(_createProject);

async function _updateProject(user: any, projectId: string, data: any, pathname: string) {
  const hasPermission = await checkPermission("projects_update");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user.userId, mod_flag: true },
      { new: true }
    );

    if (!project) return { error: "Project not found" };

    revalidatePath(pathname);
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateProject = await withAuth(_updateProject);

async function _getProjectById(user: any, projectId: string) {
  const hasPermission = await checkPermission("projects_view");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const project = await Project.findOne({
      _id: projectId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("managerId", "fullName email")
      .populate("clientId", "name email company")
      .lean();

    if (!project) return { error: "Project not found" };

    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getProjectById = await withAuth(_getProjectById);

async function _deleteProject(user: any, projectId: string, pathname: string) {
  const hasPermission = await checkPermission("projects_delete");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: user.organizationId },
      { del_flag: true, deletedBy: user.userId },
      { new: true }
    );

    if (!project) return { error: "Project not found" };

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const deleteProject = await withAuth(_deleteProject);
