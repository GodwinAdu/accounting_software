"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/table/data-table"
import { CellAction } from "@/components/table/cell-action"
import { deleteUser, toggleUserStatus, resendInvitation, resetUserPassword, changeUserRole, toggle2FA, revokeUserSessions, exportUserData } from "@/lib/actions/user.action"
import { Mail, Phone, Shield, UserX, UserCheck, Send, KeyRound, UserCog, Lock, LogOut, Download, History, Clock, Building2, FileText, MessageSquare, Bell } from "lucide-react"
import { toast } from "sonner"

interface User {
  _id: string
  fullName: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  emailVerified: boolean
  profileImage?: string
  employment?: {
    employeeID: string
    departmentId: { name: string }
  }
}

export default function UsersList({
  users,
  organizationId,
  userId,
}: {
  users: User[]
  organizationId: string
  userId: string
}) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.original.profileImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {row.original.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              {row.original.email}
            </div>
            {row.original.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {row.original.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "employeeID",
      header: "Employee ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {row.original.employment?.employeeID || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const roleColors: Record<string, string> = {
          admin: "default",
          manager: "secondary",
          accountant: "outline",
          staff: "secondary",
        }
        return (
          <Badge variant={roleColors[row.original.role] as any || "secondary"}>
            <Shield className="h-3 w-3 mr-1" />
            {row.original.role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.original.isActive ? "default" : "secondary"} className="w-fit">
            {row.original.isActive ? (
              <><UserCheck className="h-3 w-3 mr-1" />Active</>
            ) : (
              <><UserX className="h-3 w-3 mr-1" />Inactive</>
            )}
          </Badge>
          {!row.original.emailVerified && (
            <Badge variant="outline" className="text-xs w-fit text-orange-600 border-orange-600">
              Pending Verification
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CellAction
          data={row.original}
          actions={[
            {
              label: "View Details",
              type: "view",
              icon: <Mail className="h-4 w-4" />,
              href: `/${organizationId}/dashboard/${userId}/settings/users/${row.original._id}`,
            },
            {
              label: "Edit User",
              type: "edit",
              href: `/${organizationId}/dashboard/${userId}/settings/users/${row.original._id}`,
            },
            {
              label: row.original.isActive ? "Deactivate" : "Activate",
              type: "custom",
              icon: row.original.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
              onClick: async (user) => {
                const result = await toggleUserStatus(user._id)
                if (result.success) {
                  toast.success(`User ${row.original.isActive ? 'deactivated' : 'activated'} successfully`)
                  window.location.reload()
                } else {
                  toast.error(result.error || 'Failed to update status')
                }
              },
            },
            {
              label: "Change Role",
              type: "custom",
              icon: <UserCog className="h-4 w-4" />,
              onClick: async (user) => {
                const newRole = prompt(`Enter new role for ${user.fullName}:\n\nOptions: admin, manager, accountant, staff`, user.role)
                if (newRole && ['admin', 'manager', 'accountant', 'staff'].includes(newRole)) {
                  const result = await changeUserRole(user._id, newRole)
                  if (result.success) {
                    toast.success('Role changed successfully')
                    window.location.reload()
                  } else {
                    toast.error(result.error || 'Failed to change role')
                  }
                } else if (newRole) {
                  toast.error('Invalid role. Choose: admin, manager, accountant, or staff')
                }
              },
            },
            {
              label: "Transfer Department",
              type: "custom",
              icon: <Building2 className="h-4 w-4" />,
              href: `/${organizationId}/dashboard/${userId}/settings/users/${row.original._id}`,
            },
            {
              label: "Resend Invitation",
              type: "custom",
              icon: <Send className="h-4 w-4" />,
              onClick: async (user) => {
                const result = await resendInvitation(user._id)
                if (result.success) {
                  toast.success('Invitation email sent successfully')
                } else {
                  toast.error(result.error || 'Failed to send invitation')
                }
              },
              hidden: row.original.emailVerified,
            },
            {
              label: "Reset Password",
              type: "custom",
              icon: <KeyRound className="h-4 w-4" />,
              onClick: async (user) => {
                const result = await resetUserPassword(user._id)
                if (result.success) {
                  toast.success('Password reset email sent successfully')
                } else {
                  toast.error(result.error || 'Failed to reset password')
                }
              },
            },
            {
              label: "Toggle 2FA",
              type: "custom",
              icon: <Lock className="h-4 w-4" />,
              onClick: async (user) => {
                const result = await toggle2FA(user._id)
                if (result.success) {
                  toast.success('2FA settings updated')
                  window.location.reload()
                } else {
                  toast.error(result.error || 'Failed to update 2FA')
                }
              },
            },
            {
              label: "View Login History",
              type: "custom",
              icon: <History className="h-4 w-4" />,
              href: `/${organizationId}/dashboard/${userId}/settings/users/${row.original._id}/login-history`,
            },
            {
              label: "View Activity Log",
              type: "custom",
              icon: <FileText className="h-4 w-4" />,
              href: `/${organizationId}/dashboard/${userId}/settings/audit-logs?userId=${row.original._id}`,
            },
            {
              label: "Revoke All Sessions",
              type: "custom",
              icon: <LogOut className="h-4 w-4" />,
              onClick: async (user) => {
                if (confirm(`Force logout ${user.fullName} from all devices?`)) {
                  const result = await revokeUserSessions(user._id)
                  if (result.success) {
                    toast.success('All sessions revoked successfully')
                  } else {
                    toast.error(result.error || 'Failed to revoke sessions')
                  }
                }
              },
            },
            {
              label: "Export User Data",
              type: "custom",
              icon: <Download className="h-4 w-4" />,
              onClick: async (user) => {
                const result = await exportUserData(user._id)
                if (result.success && result.data) {
                  const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `user-${user.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
                  a.click()
                  window.URL.revokeObjectURL(url)
                  toast.success('User data exported successfully')
                } else {
                  toast.error(result.error || 'Failed to export data')
                }
              },
            },
            {
              label: "Delete User",
              type: "delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteUser(id)
            if (!result.success) throw new Error(result.error)
          }}
        />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{users.length}</span> users
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={users} searchKey="fullName" />
    </div>
  )
}
