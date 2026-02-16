import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchDepartments } from "@/lib/actions/department.action"
import UserForm from "../_components/user-form"

export default async function NewUserPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params

  if (!user) redirect("/sign-in")

  const deptResult = await fetchDepartments()
  const departments = deptResult.success ? deptResult.departments : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New User</h1>
        <p className="text-muted-foreground">Create a new staff member for your organization</p>
      </div>

      <UserForm organizationId={organizationId} userId={userId} departments={departments} />
    </div>
  )
}
