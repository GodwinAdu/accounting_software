"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import { User, withAuth } from "../helpers/auth";
import Role from "../models/role.model";
import { logAudit } from "../helpers/audit";

interface RoleData {
    name: string;
    displayName: string;
    description?: string;
    permissions: Record<string, boolean>;
}

async function _createRole(user: User, roleData: RoleData, path: string) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const existingRole = await Role.findOne({ 
            name: roleData.name,
            organizationId: user.organizationId,
            del_flag: false 
        });
        if (existingRole) {
            throw new Error("Role with this name already exists");
        }

        const role = await Role.create({
            name: roleData.name,
            displayName: roleData.displayName,
            description: roleData.description,
            permissions: roleData.permissions,
            organizationId: user.organizationId,
            createdBy: user._id
        });
        
        await logAudit({
            userId: user._id as string,
            organizationId: user.organizationId as string,
            action: 'create_role',
            resource: 'role',
            resourceId: role._id.toString(),
            details: {
                after: { name: roleData.name, displayName: roleData.displayName }
            }
        });

        revalidatePath(path);
        return JSON.parse(JSON.stringify(role));
    } catch (error) {
        console.log("Error creating role:", error);
        throw error;
    }
}

async function _getAllRoles(user: User) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const roles = await Role.find({
            organizationId: user.organizationId,
            del_flag: false
        }).sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(roles));
    } catch (error) {
        console.log("Error fetching roles:", error);
        throw error;
    }
}

async function _updateRole(user: User, roleId: string, roleData: RoleData, path: string) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const oldRole = await Role.findOne({ 
            _id: roleId,
            organizationId: user.organizationId,
            del_flag: false
        });
        if (!oldRole) throw new Error("Role not found");

        const existingRole = await Role.findOne({ 
            name: roleData.name, 
            _id: { $ne: roleId },
            organizationId: user.organizationId,
            del_flag: false
        });
        if (existingRole) {
            throw new Error("Role with this name already exists");
        }

        const role = await Role.findByIdAndUpdate(
            roleId,
            {
                name: roleData.name,
                displayName: roleData.displayName,
                description: roleData.description,
                permissions: roleData.permissions,
                modifiedBy: user._id,
                mod_flag: true
            },
            { new: true, runValidators: true }
        );

        if (!role) throw new Error("Role not found");
        
        await logAudit({
            userId: user._id as string,
            organizationId: user.organizationId as string,
            action: 'update_role',
            resource: 'role',
            resourceId: role._id.toString(),
            details: {
                before: { name: oldRole.name, displayName: oldRole.displayName },
                after: { name: roleData.name, displayName: roleData.displayName }
            }
        });

        revalidatePath(path);
        return JSON.parse(JSON.stringify(role));
    } catch (error) {
        console.log("Error updating role:", error);
        throw error;
    }
}

async function _deleteRole(user: User, roleId: string, path: string) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const role = await Role.findOneAndUpdate(
            { 
                _id: roleId,
                organizationId: user.organizationId,
                del_flag: false
            },
            {
                del_flag: true,
                deletedBy: user._id
            },
            { new: true }
        );
        if (!role) throw new Error("Role not found");
        
        await logAudit({
            userId: user._id as string,
            organizationId: user.organizationId as string,
            action: 'delete_role',
            resource: 'role',
            resourceId: role._id.toString(),
            details: {
                before: { name: role.name, displayName: role.displayName }
            }
        });

        revalidatePath(path);
        return { success: true, message: "Role deleted successfully" };
    } catch (error) {
        console.log("Error deleting role:", error);
        throw error;
    }
}

async function _fetchRoleByName(user: User, roleName: string) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const role = await Role.findOne({
            name:roleName,
            organizationId: user.organizationId,
            del_flag: false
        });
        if (!role) throw new Error("Role not found");

        return JSON.parse(JSON.stringify(role));
    } catch (error) {
        console.log("Error fetching role:", error);
        throw error;
    }
}

async function _fetchRoleById(user: User, roleId: string) {
    try {
        if (!user) throw new Error("User not authorized");

        await connectToDB();

        const role = await Role.findOne({
            _id: roleId,
            organizationId: user.organizationId,
            del_flag: false
        });
        if (!role) throw new Error("Role not found");

        return JSON.parse(JSON.stringify(role));
    } catch (error) {
        console.log("Error fetching role:", error);
        throw error;
    }
}

export const createRole = await withAuth(_createRole);
export const getAllRoles = await withAuth(_getAllRoles);
export const updateRole = await withAuth(_updateRole);
export const deleteRole = await withAuth(_deleteRole);
export const fetchRoleByName = await withAuth(_fetchRoleByName);
export const fetchRoleById = await withAuth(_fetchRoleById);