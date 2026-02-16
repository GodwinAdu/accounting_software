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
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteAuditLog, clearAllAuditLogs } from "@/lib/actions/audit-log.action"
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
  const [isDeleting, setIsDeleting] = useState(false)

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
          <Button variant="destructive" size="sm" onClick={() => setShowClearAll(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.userId?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Action</p>
                  <Badge className={actionColors[selectedLog.action]}>{selectedLog.action}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Resource</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedLog.resource}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Resource ID</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.resourceId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">IP Address</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.ipAddress || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Details</p>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
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
    </>
  )
}
