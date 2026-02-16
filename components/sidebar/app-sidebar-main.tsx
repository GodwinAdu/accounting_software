import React from 'react'
import { AppSidebar } from './app-sidebar'
import { currentUserRole } from '@/lib/helpers/get-user-role';
import { fetchOrganizationUserById } from '@/lib/actions/organization.action';
import { currentUser } from '@/lib/helpers/session';


const AppSidebarMain = async () => {

    const user = await currentUser();
    
    if (!user) {
        return null;
    }

    const [organization, userRole] = await Promise.all([
        fetchOrganizationUserById(),
        currentUserRole(),
    ])


    return (
        <>
            <AppSidebar userRole={userRole as IRole} organization={organization} user={user} />
        </>
    )
}

export default AppSidebarMain