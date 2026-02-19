"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import Department from "../models/deparment.model";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createDepartment(user: User, values: { name: string }) {
    try {
        await checkWriteAccess(String(user.organizationId));
        const { name } = values

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        const existingDepartment = await Department.findOne({ name, organizationId });

        if (existingDepartment) {
            throw new Error("Department already exists");
        }

        const department = await Department.create({
            organizationId,
            name,
            createdBy: user?._id,
            action_type: "created",
        });

        await logAudit({
            organizationId: String(organizationId),
            userId: String(user._id || user.id),
            action: "create",
            resource: "department",
            resourceId: String(department._id),
            details: { after: department },
        });

    } catch (error) {
        console.log("unable to create new department", error)
        throw error;
    }
}

async function _fetchDepartmentById(user: User, id: string) {
    try {

        if (!user) throw new Error('user not logged in');

        await connectToDB();
        const department = await Department.findById(id)

        if (!department) {
            console.log("department doesn't exist")
        }
        return JSON.parse(JSON.stringify(department));
    } catch (error) {
        console.log("unable to fetch department", error);
        throw error;
    }
}


async function _getAllDepartments(user: User) {
    try {

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        const departments = await Department.find({ organizationId: organizationId as any })
            .populate("createdBy", "fullName")

        if (!departments || departments.length === 0) {

            console.log("departments don't exist");

            return []; // or throw an error if you want to handle it differently
        }

        return JSON.parse(JSON.stringify(departments));

    } catch (error) {
        console.error("Error fetching Departments:", error);
        throw error; // throw the error to handle it at a higher Day if needed
    }
}

interface UpdateDepartmentProps {
    name: string;
    createdBy: string;
}

async function _updateDepartment(user: User, departmentId: string, values: UpdateDepartmentProps, path: string) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error('user not logged in');

        await connectToDB();

        const oldDepartment = await Department.findById(departmentId);
        if (!oldDepartment) {
            throw new Error("Department not found");
        }

        const newValues = {
            ...values,
            mod_flag: true,
            modifyBy: user._id,
            action_type: "updated",
        }
        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            { $set: newValues },
            { new: true, runValidators: true }
        );

        await logAudit({
            organizationId: String(user.organizationId),
            userId: String(user._id || user.id),
            action: "update",
            resource: "department",
            resourceId: String(departmentId),
            details: { before: oldDepartment, after: updatedDepartment },
        });

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedDepartment));
    } catch (error) {
        console.error("Error updating department:", error);
        throw error;
    }
}

async function _deleteDepartment(user: User, id: string) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error('user not logged in');
        const organizationId = user.organizationId as string;
        await connectToDB();

        const department = await Department.findByIdAndUpdate(
            id,
            { del_flag: true, deletedBy: user._id },
            { new: true }
        );
        
        if (!department) {
            return { success: false, message: "Department not found" };
        }

        await logAudit({
            organizationId: String(organizationId),
            userId: String(user._id || user.id),
            action: "delete",
            resource: "department",
            resourceId: String(id),
            details: { before: department },
        });

        return { success: true, message: "department deleted successfully" };
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
    }
}




export const createDepartment = await withAuth(_createDepartment);
export const fetchDepartmentById = await withAuth(_fetchDepartmentById);
export const getAllDepartments = await withAuth(_getAllDepartments);
export const fetchDepartments = await withAuth(_getAllDepartments);
export const updateDepartment = await withAuth(_updateDepartment);
export const deleteDepartment = await withAuth(_deleteDepartment)
