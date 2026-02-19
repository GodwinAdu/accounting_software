import { currentUser } from "@/lib/helpers/session"
import { redirect } from "next/navigation"
import { fetchIntegrations } from "@/lib/actions/integration.action"
import IntegrationCard from "./_components/integration-card"

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await currentUser()
  const { organizationId, userId } = await params

  if (!user) redirect("/sign-in")
  // if (user._id !== userId) redirect(`/${organizationId}/dashboard/${user._id}`)

  const result = await fetchIntegrations()
  const integrations = result.success ? result.integrations : []

  const paymentIntegrations = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments via credit cards and bank transfers",
      category: "payment",
      icon: "💳",
      status: integrations.find((i: any) => i.provider === "stripe")?.status || "disconnected",
    },
    {
      id: "paystack",
      name: "Paystack",
      description: "African payment gateway with card and bank support",
      category: "payment",
      icon: "💰",
      status: integrations.find((i: any) => i.provider === "paystack")?.status || "disconnected",
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "African payment gateway for local transactions",
      category: "payment",
      icon: "🦋",
      status: integrations.find((i: any) => i.provider === "flutterwave")?.status || "disconnected",
    },
  ]

  const storageIntegrations = [
    {
      id: "aws-s3",
      name: "AWS S3",
      description: "Store documents and files in Amazon S3",
      category: "storage",
      icon: "☁️",
      status: integrations.find((i: any) => i.provider === "aws-s3")?.status || "disconnected",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect PayFlow with your favorite tools and services</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Payment Gateways</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paymentIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Storage</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {storageIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
