"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Project from "@/lib/models/project.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";
import { revalidatePath } from "next/cache";

async function _updateProjectStatus(user: any, projectId: string, status: string, pathname: string) {
  const hasPermission = await checkPermission("projects_update");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: user.organizationId, del_flag: false },
      { status, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!project) return { error: "Project not found" };

    revalidatePath(pathname);
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateProjectStatus = await withAuth(_updateProjectStatus);

async function _getProjectStatusSuggestion(user: any, projectId: string) {
  const hasPermission = await checkPermission("projects_view");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const project = await Project.findOne({
      _id: projectId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!project) return { error: "Project not found" };

    const now = new Date();
    const endDate = project.endDate ? new Date(project.endDate) : null;
    const startDate = new Date(project.startDate);
    
    let suggestion = project.status;
    let reason = "";

    if (project.status === "planning" && startDate <= now) {
      suggestion = "active";
      reason = "Project start date has passed";
    } else if (project.status === "active" && endDate && endDate < now) {
      suggestion = "completed";
      reason = "Project end date has passed";
    } else if (project.status === "active" && project.budget > 0 && project.actualCost >= project.budget) {
      suggestion = "on_hold";
      reason = "Budget exceeded";
    }

    return {
      success: true,
      data: {
        currentStatus: project.status,
        suggestedStatus: suggestion,
        reason,
        shouldUpdate: suggestion !== project.status,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getProjectStatusSuggestion = await withAuth(_getProjectStatusSuggestion);
