"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import Department from "../models/deparment.model";



async function _createDepartment(user: User, values: { name: string }) {
    try {
        const { name } = values

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        const existingDepartment = await Department.findOne({ name });

        if (existingDepartment) {
            throw new Error("Department already exists");
        }

        const department = new Department({
            organizationId,
            name,
            createdBy: user?._id,
            action_type: "created",
        });

        // const history = new History({
        //     organizationId,
        //     actionType: 'DEPARTMENT_CREATED', // Use a relevant action type
        //     details: {
        //         itemId: department._id,
        //         deletedAt: new Date(),
        //     },
        //     message: `${user.fullName} created new department with (ID: ${department._id}) on ${new Date().toLocaleString()}.`,
        //     performedBy: user._id, // User who performed the action,
        //     entityId: department._id,  // The ID of the deleted unit
        //     entityType: 'DEPARTMENT',  // The type of the entity
        // });

        await Promise.all([
            department.save(),
            // history.save()
        ]);

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
        if (!user) throw new Error('user not logged in');

        await connectToDB();

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

        if (!updatedDepartment) {
            console.log("department not found");
            return null;
        }

        console.log("Update successful");

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedDepartment));
    } catch (error) {
        console.error("Error updating department:", error);
        throw error;
    }
}

async function _deleteDepartment(user: User, id: string) {
    try {
        if (!user) throw new Error('user not logged in');
        const organizationId = user.organizationId as string;
        await connectToDB();

        const department = await Department.findById(id);
        if (!department) {
            return { success: false, message: "Class not found" };
        }
        const departmentName = department?.name || "Unknown Class";


        // await deleteDocument({
        //     actionType: 'DEPARTMENT_DELETED',
        //     documentId: id,
        //     collectionName: 'Department',
        //     userId: `${user?._id}`,
        //     organizationId,
        //     trashMessage: `"${departmentName}" (ID: ${id}) was moved to trash by ${user.fullName}.`,
        //     historyMessage: `User ${user.fullName} deleted "${departmentName}" (ID: ${id}) on ${new Date().toLocaleString()}.`
        // });

        return { success: true, message: "department deleted successfully" };
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error; // throw the error to handle it at a higher level if needed
    }

}




export const createDepartment = await withAuth(_createDepartment);
export const fetchDepartmentById = await withAuth(_fetchDepartmentById);
export const getAllDepartments = await withAuth(_getAllDepartments);
export const updateDepartment = await withAuth(_updateDepartment);
export const deleteDepartment = await withAuth(_deleteDepartment)