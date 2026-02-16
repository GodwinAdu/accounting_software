"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, TrendingUp } from "lucide-react"

interface AuditLogStatsProps {
  stats: {
    actionStats: { _id: string; count: number }[]
    resourceStats: { _id: string; count: number }[]
    recentActivity: number
  }
}

export default function AuditLogStats({ stats }: AuditLogStatsProps) {
  const totalActions = stats.actionStats.reduce((sum, stat) => sum + stat.count, 0)
  const topAction = stats.actionStats[0]
  const topResource = stats.resourceStats[0]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentActivity.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Active</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{topResource?._id || "N/A"}</div>
          <p className="text-xs text-muted-foreground">{topResource?.count || 0} activities</p>
        </CardContent>
      </Card>
    </div>
  )
}
