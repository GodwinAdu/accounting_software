import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import EmailTemplateForm from "../_components/email-template-form"

export default async function NewEmailTemplatePage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params

  if (!user) redirect("/sign-in")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Email Template</h1>
        <p className="text-muted-foreground">Design a custom email template for your organization</p>
      </div>

      <EmailTemplateForm organizationId={organizationId} userId={userId} />
    </div>
  )
}
