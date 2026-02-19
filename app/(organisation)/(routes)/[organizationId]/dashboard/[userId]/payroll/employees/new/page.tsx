import { Separator } from "@/components/ui/separator";
import { EmployeeForm } from "./_components/employee-form";
import Heading from "@/components/commons/Header";
import { getOrganizationUsers } from "@/lib/actions/organization.action";

export default async function NewEmployeePage() {
  const users = await getOrganizationUsers();
  console.log("users", users.users);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Employee"
        description="Add a new employee to your organization"
      />
      <Separator />
      <EmployeeForm users={users?.users} />
    </div>
  );
}
