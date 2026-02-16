import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchEmailTemplateById } from "@/lib/actions/email-template.action"
import EmailTemplateForm from "../_components/email-template-form"

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string; templateId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId, templateId } = await params

  if (!user) redirect("/sign-in")

  const result = await fetchEmailTemplateById(templateId)

  if (!result.success) {
    redirect(`/${organizationId}/dashboard/${userId}/settings/email-templates`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Email Template</h1>
        <p className="text-muted-foreground">Update your email template</p>
      </div>

      <EmailTemplateForm organizationId={organizationId} userId={userId} template={result.template} />
    </div>
  )
}
