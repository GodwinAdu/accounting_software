"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChevronLeft, ChevronRight, Eye, Trash2, Archive, Database } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteAuditLog, clearAllAuditLogs } from "@/lib/actions/audit-log.action"
import { archiveOldAuditLogs, optimizeAuditLogIndexes } from "@/lib/actions/audit-log-maintenance.action"
import { toast } from "sonner"

interface AuditLog {
  _id: string
  userId: { fullName: string; email: string }
  action: string
  resource: string
  resourceId?: string
  details: any
  ipAddress?: string
  status: string
  createdAt: string
}

export default function AuditLogTable({
  logs,
  pagination,
  organizationId,
  userId,
}: {
  logs: AuditLog[]
  pagination: any
  organizationId: string
  userId: string
}) {
  const router = useRouter()
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showClearAll, setShowClearAll] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const actionColors: Record<string, string> = {
    create: "bg-green-500",
    update: "bg-blue-500",
    delete: "bg-red-500",
    view: "bg-gray-500",
    login: "bg-purple-500",
    logout: "bg-orange-500",
    export: "bg-yellow-500",
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", page.toString())
    router.push(`/${organizationId}/dashboard/${userId}/settings/audit-logs?${params.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const result = await deleteAuditLog(deleteId)
    setIsDeleting(false)

    if (result.success) {
      toast.success("Audit log deleted")
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete log")
    }
  }

  const handleClearAll = async () => {
    setIsDeleting(true)
    const result = await clearAllAuditLogs()
    setIsDeleting(false)

    if (result.success) {
      toast.success(`Cleared ${result.deletedCount} audit logs`)
      setShowClearAll(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to clear logs")
    }
  }

  const handleArchive = async () => {
    setIsArchiving(true)
    const result = await archiveOldAuditLogs()
    setIsArchiving(false)

    if (result.success) {
      toast.success(result.message)
      setShowArchive(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to archive logs")
    }
  }

  const handleOptimizeIndexes = async () => {
    const result = await optimizeAuditLogIndexes()
    if (result.success) {
      toast.success("Database indexes optimized")
    } else {
      toast.error(result.error || "Failed to optimize indexes")
    }
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No audit logs found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Log</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowArchive(true)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive Old
            </Button>
            <Button variant="outline" size="sm" onClick={handleOptimizeIndexes}>
              <Database className="mr-2 h-4 w-4" />
              Optimize
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowClearAll(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{log.userId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{log.userId?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={actionColors[log.action] || "bg-gray-500"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{log.resource}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ipAddress || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(log._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-sm font-semibold">{selectedLog.userId?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{selectedLog.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action</p>
                  <Badge className={actionColors[selectedLog.action]}>{selectedLog.action}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resource</p>
                  <p className="text-sm font-semibold capitalize">{selectedLog.resource}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resource ID</p>
                  <p className="text-sm font-mono text-xs break-all">{selectedLog.resourceId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                  <p className="text-sm font-semibold">{selectedLog.ipAddress || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="text-sm font-semibold">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedLog.status === "success" ? "default" : "destructive"}>
                    {selectedLog.status}
                  </Badge>
                </div>
              </div>

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Details</p>
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audit Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this audit log? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearAll} onOpenChange={setShowClearAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Audit Logs</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL audit logs? This will permanently remove all activity history and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} disabled={isDeleting} className="bg-destructive text-destructive-foreground">
              {isDeleting ? "Clearing..." : "Clear All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchive} onOpenChange={setShowArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Old Audit Logs</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete audit logs older than 90 days to keep the database lean and improve performance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={isArchiving}>
              {isArchiving ? "Archiving..." : "Archive Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
