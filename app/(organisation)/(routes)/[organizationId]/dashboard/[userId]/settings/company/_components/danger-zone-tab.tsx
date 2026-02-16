"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { resetOrganizationSettings, deleteOrganizationData, deleteOrganization } from "@/lib/actions/organization.action"
import { logout } from "@/lib/helpers/session"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DangerZoneTab() {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isDeletingData, setIsDeletingData] = useState(false)

  const handleDeleteOrganization = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteOrganization()
      
      if (result.success) {
        toast.success("Organization deleted successfully")
        await logout("/")
      } else {
        toast.error(result.error || "Failed to delete organization")
      }
    } catch (error) {
      toast.error("Failed to delete organization")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAllData = async () => {
    setIsDeletingData(true)
    try {
      const result = await deleteOrganizationData()
      
      if (result.success) {
        toast.success("All data deleted successfully")
        setConfirmText("")
      } else {
        toast.error(result.error || "Failed to delete data")
      }
    } catch (error) {
      toast.error("Failed to delete data")
    } finally {
      setIsDeletingData(false)
    }
  }

  const handleResetSettings = async () => {
    setIsResetting(true)
    try {
      const result = await resetOrganizationSettings()
      
      if (result.success) {
        toast.success("Settings reset to defaults")
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error(result.error || "Failed to reset settings")
      }
    } catch (error) {
      toast.error("Failed to reset settings")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-900 dark:text-red-100">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-semibold">Danger Zone</p>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          These actions are irreversible. Please proceed with caution.
        </p>
      </div>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Reset Settings</CardTitle>
          <CardDescription>Reset all organization settings to default values</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950" disabled={isResetting}>
                {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all organization settings to their default values. Your data will not be affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetSettings} className="bg-red-600 hover:bg-red-700" disabled={isResetting}>
                  {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Delete All Data</CardTitle>
          <CardDescription>
            Permanently delete all invoices, transactions, employees, and other data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950" disabled={isDeletingData}>
                {isDeletingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your data including invoices, transactions, employees, and reports. 
                  This action cannot be undone. Your organization account will remain active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllData} className="bg-red-600 hover:bg-red-700" disabled={isDeletingData}>
                  {isDeletingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Delete Organization</CardTitle>
          <CardDescription>
            Permanently delete this organization and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium">
              This will permanently delete:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1 list-disc list-inside">
              <li>All organization data and settings</li>
              <li>All user accounts and permissions</li>
              <li>All invoices, transactions, and financial records</li>
              <li>All employees and payroll data</li>
              <li>All reports and analytics</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Type <span className="font-bold">DELETE</span> to confirm</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-red-200 focus:border-red-400"
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={confirmText !== "DELETE" || isDeleting}
                className="w-full"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Organization Permanently"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your organization
                  and remove all data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteOrganization}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
