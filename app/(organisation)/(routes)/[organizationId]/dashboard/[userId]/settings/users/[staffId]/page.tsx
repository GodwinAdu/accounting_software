import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchUserByIdAction, fetchDepartments } from "@/lib/actions/user.action"
import UserForm from "../_components/user-form"

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string; staffId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId, staffId } = await params

  if (!user) redirect("/sign-in")

  const [userResult, deptResult] = await Promise.all([
    fetchUserByIdAction(staffId),
    fetchDepartments(),
  ])

  if (!userResult.success) {
    redirect(`/${organizationId}/dashboard/${userId}/settings/users`)
  }

  const departments = deptResult.success ? deptResult.departments : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit User</h1>
        <p className="text-muted-foreground">Update user information</p>
      </div>

      <UserForm organizationId={organizationId} userId={userId} departments={departments} user={userResult.user} />
    </div>
  )
}
