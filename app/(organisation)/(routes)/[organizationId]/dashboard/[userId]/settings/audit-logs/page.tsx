import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchAuditLogs, fetchAuditLogStats } from "@/lib/actions/audit-log.action"
import AuditLogFilters from "./_components/audit-log-filters"
import AuditLogStats from "./_components/audit-log-stats"
import AuditLogTable from "./_components/audit-log-table"

export default async function AuditLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string; userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params
  const filters = await searchParams

  if (!user) redirect("/sign-in")

  const [logsResult, statsResult] = await Promise.all([
    fetchAuditLogs({
      action: filters.action,
      resource: filters.resource,
      userId: filters.userId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page: filters.page ? parseInt(filters.page) : 1,
    }),
    fetchAuditLogStats(),
  ])

  const logs = logsResult.success ? logsResult.logs : []
  const pagination = logsResult.success ? logsResult.pagination : null
  const stats = statsResult.success ? statsResult.stats : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Track all activities and changes in your organization</p>
      </div>

      {stats && <AuditLogStats stats={stats} />}

      <AuditLogFilters organizationId={organizationId} userId={userId} />

      <AuditLogTable logs={logs} pagination={pagination} organizationId={organizationId} userId={userId} />
    </div>
  )
}
