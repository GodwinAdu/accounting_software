import { cache } from "react";
import { fetchRoleByName } from "../actions/role.action";
import { currentUser } from "./session";

// In-memory cache for roles
const roleCache: { [key: string]: { role: any; timestamp: number } } = {};
const ROLE_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const currentUserRole = cache(async () => {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error('User not found');
        }

        const roleName = user?.role as string;
        const cacheKey = `${user.organizationId}_${roleName}`;
        const now = Date.now();
        
        // Check cache
        const cached = roleCache[cacheKey];
        if (cached && now - cached.timestamp < ROLE_CACHE_TTL) {
            return cached.role;
        }
       
        const userRole = await fetchRoleByName(roleName);

        if (!userRole) {
            console.log("cant find User role");
            return;
        }
        
        // Cache the role
        roleCache[cacheKey] = {
            role: userRole,
            timestamp: now
        };

        return userRole;

    } catch (error) {
        console.log("Error happen while fetching role", error)
    }
});

// Clear role cache when role is updated
export function clearRoleCache(organizationId: string, roleName: string) {
    const cacheKey = `${organizationId}_${roleName}`;
    delete roleCache[cacheKey];
}