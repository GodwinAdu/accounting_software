import { Separator } from "@/components/ui/separator";
import { EmployeeForm } from "./_components/employee-form";
import Heading from "@/components/commons/Header";
import { getOrganizationUsers } from "@/lib/actions/organization.action";
import { getAllDepartments } from "@/lib/actions/department.action";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export default async function NewEmployeePage() {
  const user = await currentUser();
  const users = await getOrganizationUsers();
  const departments = await getAllDepartments();
  const hasAIAccess = await checkModuleAccess(user?.organizationId!, "ai");
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Employee"
        description="Add a new employee to your organization"
      />
      <Separator />
      <EmployeeForm users={users?.users} departments={departments} hasAIAccess={hasAIAccess} />
    </div>
  );
}
