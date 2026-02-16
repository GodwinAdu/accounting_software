"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { deleteEmailTemplate } from "@/lib/actions/email-template.action"
import { toast } from "sonner"
import { useState } from "react"
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

interface EmailTemplate {
  _id: string
  name: string
  type: string
  subject: string
  isActive: boolean
  lastModified: string
}

export default function EmailTemplateList({
  templates,
  organizationId,
  userId,
}: {
  templates: EmailTemplate[]
  organizationId: string
  userId: string
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const result = await deleteEmailTemplate(deleteId)
    setIsDeleting(false)

    if (result.success) {
      toast.success("Template deleted successfully")
      setDeleteId(null)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to delete template")
    }
  }

  const templateTypes = {
    invoice: "Invoice",
    receipt: "Receipt",
    "payment-reminder": "Payment Reminder",
    "welcome": "Welcome Email",
    "password-reset": "Password Reset",
    "payroll": "Payroll Notification",
    "expense-approval": "Expense Approval",
    "custom": "Custom",
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No email templates yet</p>
          <Link href={`/${organizationId}/dashboard/${userId}/settings/email-templates/new`}>
            <Button>Create Your First Template</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {templateTypes[template.type as keyof typeof templateTypes] || template.type}
                  </CardDescription>
                </div>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Subject:</p>
                <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/${organizationId}/dashboard/${userId}/settings/email-templates/${template._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setDeleteId(template._id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
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
    </>
  )
}
