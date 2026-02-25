 "use server";

import { connectToDB } from "@/lib/connection/mongoose";
import ProjectTask from "@/lib/models/project-task.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createTask(user: any, data: any, pathname: string) {
  try {
    await connectToDB();

    const task = await ProjectTask.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    revalidatePath(pathname);
    return { success: true, data: JSON.parse(JSON.stringify(task)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createTask = await withAuth(_createTask);

async function _getProjectTasks(user: any, projectId: string) {
  try {
    await connectToDB();

    const tasks = await ProjectTask.find({
      organizationId: user.organizationId,
      projectId,
      del_flag: false,
    })
      .populate("assignedTo", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(tasks)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getProjectTasks = await withAuth(_getProjectTasks);

async function _updateTask(user: any, taskId: string, data: any, pathname: string) {
  try {
    await connectToDB();

    const task = await ProjectTask.findOneAndUpdate(
      { _id: taskId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!task) return { error: "Task not found" };

    revalidatePath(pathname);
    return { success: true, data: JSON.parse(JSON.stringify(task)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateTask = await withAuth(_updateTask);

async function _deleteTask(user: any, taskId: string, pathname: string) {
  try {
    await connectToDB();

    const task = await ProjectTask.findOneAndUpdate(
      { _id: taskId, organizationId: user.organizationId },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!task) return { error: "Task not found" };

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const deleteTask = await withAuth(_deleteTask);
