"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Filter, X } from "lucide-react"
import { exportAuditLogs } from "@/lib/actions/audit-log.action"
import { toast } from "sonner"

export default function AuditLogFilters({ organizationId, userId }: { organizationId: string; userId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExporting, setIsExporting] = useState(false)

  const [filters, setFilters] = useState({
    action: searchParams.get("action") || "all",
    resource: searchParams.get("resource") || "all",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.action && filters.action !== "all") params.set("action", filters.action)
    if (filters.resource && filters.resource !== "all") params.set("resource", filters.resource)
    if (filters.startDate) params.set("startDate", filters.startDate)
    if (filters.endDate) params.set("endDate", filters.endDate)

    router.push(`/${organizationId}/dashboard/${userId}/settings/audit-logs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ action: "all", resource: "all", startDate: "", endDate: "" })
    router.push(`/${organizationId}/dashboard/${userId}/settings/audit-logs`)
  }

  const handleExport = async () => {
    setIsExporting(true)
    const result = await exportAuditLogs(filters)
    setIsExporting(false)

    if (result.success) {
      const csv = convertToCSV(result.logs)
      downloadCSV(csv, `audit-logs-${new Date().toISOString()}.csv`)
      toast.success("Audit logs exported successfully")
    } else {
      toast.error(result.error || "Failed to export logs")
    }
  }

  const convertToCSV = (logs: any[]) => {
    const headers = ["Date", "User", "Action", "Resource", "Status", "IP Address"]
    const rows = logs.map((log) => [
      new Date(log.createdAt).toLocaleString(),
      log.userId?.fullName || "Unknown",
      log.action,
      log.resource,
      log.status,
      log.ipAddress || "N/A",
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Resource</Label>
            <Select value={filters.resource} onValueChange={(value) => setFilters({ ...filters, resource: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="invisible">Actions</Label>
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
