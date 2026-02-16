import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchEmailTemplates } from "@/lib/actions/email-template.action"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import EmailTemplateList from "./_components/email-template-list"

export default async function EmailTemplatesPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params

  if (!user) redirect("/sign-in")

  const result = await fetchEmailTemplates()
  const templates = result.success ? result.templates : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">Customize email templates for invoices, receipts, and notifications</p>
        </div>
        <Link href={`/${organizationId}/dashboard/${userId}/settings/email-templates/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      <EmailTemplateList templates={templates} organizationId={organizationId} userId={userId} />
    </div>
  )
}
