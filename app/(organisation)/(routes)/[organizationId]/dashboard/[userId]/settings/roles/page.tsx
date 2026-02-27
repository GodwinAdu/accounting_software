import Heading from '@/components/commons/Header'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getAllRoles } from '@/lib/actions/role.action'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { currentUserRole } from '@/lib/helpers/get-user-role'
import RolesDisplayPage from './_components/Roles'
import { fetchOrganizationUserById } from '@/lib/actions/organization.action'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'


type RolePermissions = {
  addRole?: boolean;
  // add other permissions as needed
};

const page = async () => {

  const [role, values, organization] = await Promise.all([
    currentUserRole(),
    getAllRoles(),
    fetchOrganizationUserById(),
  ]);

  const addRole =
    role?.permissions && 'userManagement_view' in role.permissions
      ? (role.permissions as RolePermissions).userManagement_view
      : false;

  const enabledModules = organization?.modules || {};
  const roles = Array.isArray(values) ? values : [];

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Role Management"
          description="View and manage user roles and their permissions."
        />
        {addRole && (
          <Link
            href={`roles/create-role`}
            className={cn(buttonVariants())}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create role
          </Link>
        )}
      </div>
      <Separator />
      
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <span className="font-semibold">Role Permissions:</span> Define what users can view, create, edit, or delete. Assign roles carefully to maintain data security and proper segregation of duties.
        </AlertDescription>
      </Alert>

      <div className="">
        <RolesDisplayPage roles={roles} enabledModules={enabledModules} />
      </div>
    </>
  )
}

export default page