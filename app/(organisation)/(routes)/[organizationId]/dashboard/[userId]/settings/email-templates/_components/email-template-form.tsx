"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createEmailTemplate, updateEmailTemplate } from "@/lib/actions/email-template.action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EmailTemplateFormProps {
  organizationId: string
  userId: string
  template?: any
}

export default function EmailTemplateForm({ organizationId, userId, template }: EmailTemplateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: template?.name || "",
    type: template?.type || "custom",
    subject: template?.subject || "",
    body: template?.body || "",
    isActive: template?.isActive ?? true,
  })

  const availableVariables = [
    "{{companyName}}",
    "{{customerName}}",
    "{{invoiceNumber}}",
    "{{amount}}",
    "{{dueDate}}",
    "{{paymentLink}}",
    "{{employeeName}}",
    "{{salary}}",
    "{{date}}",
  ]

  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      body: prev.body + " " + variable,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = template
      ? await updateEmailTemplate(template._id, formData)
      : await createEmailTemplate(formData)

    setIsLoading(false)

    if (result.success) {
      toast.success(template ? "Template updated successfully" : "Template created successfully")
      router.push(`/${organizationId}/dashboard/${userId}/settings/email-templates`)
    } else {
      toast.error(result.error || "Failed to save template")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>Configure the basic information for your email template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g., Invoice Reminder"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Template Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="password-reset">Password Reset</SelectItem>
                <SelectItem value="payroll">Payroll Notification</SelectItem>
                <SelectItem value="expense-approval">Expense Approval</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Invoice #{{invoiceNumber}} - Payment Due"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-muted-foreground">Enable this template for use</p>
            </div>
            <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Body</CardTitle>
          <CardDescription>Write your email content. Click variables below to insert them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <Badge key={variable} variant="outline" className="cursor-pointer" onClick={() => insertVariable(variable)}>
                  {variable}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Dear {{customerName}},&#10;&#10;This is a reminder that invoice #{{invoiceNumber}} is due on {{dueDate}}..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={12}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {template ? "Update Template" : "Create Template"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
