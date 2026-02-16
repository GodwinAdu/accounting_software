import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchOrganizationUsers } from "@/lib/actions/user.action"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import UsersList from "./_components/users-list"

export default async function UsersPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params

  if (!user) redirect("/sign-in")

  const result = await fetchOrganizationUsers()
  const users = result.success ? result.users : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage organization staff and their access</p>
        </div>
        <Link href={`/${organizationId}/dashboard/${userId}/settings/users/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <UsersList users={users} organizationId={organizationId} userId={userId} />
    </div>
  )
}
