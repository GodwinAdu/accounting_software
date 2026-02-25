"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Project from "@/lib/models/project.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getActiveProjects(user: any) {
  const hasPermission = await checkPermission("projects_view");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const projects = await Project.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["planning", "active", "on_hold"] }
    })
      .select("_id projectNumber name status")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getActiveProjects = await withAuth(_getActiveProjects);
