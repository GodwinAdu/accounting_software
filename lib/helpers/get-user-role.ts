
import { fetchRoleByName } from "../actions/role.action";
import { currentUser } from "./session";

export async function currentUserRole() {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error('User not found');
        }

        const roleName = user?.role as string;
       
        const userRole = await fetchRoleByName(roleName);

        if (!userRole) {
            console.log("cant find User role");
            return;
        }

        return userRole;

    } catch (error) {
        console.log("Error happen while fetching role", error)
    }
}