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
      id: "paypal",
      name: "PayPal",
      description: "Process payments through PayPal",
      category: "payment",
      icon: "🅿️",
      status: integrations.find((i: any) => i.provider === "paypal")?.status || "disconnected",
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

  const mobileMoneyIntegrations = [
    {
      id: "mtn-momo",
      name: "MTN Mobile Money",
      description: "Accept payments via MTN Mobile Money",
      category: "mobile-money",
      icon: "📱",
      status: integrations.find((i: any) => i.provider === "mtn-momo")?.status || "disconnected",
    },
    {
      id: "vodafone-cash",
      name: "Vodafone Cash",
      description: "Accept payments via Vodafone Cash",
      category: "mobile-money",
      icon: "📱",
      status: integrations.find((i: any) => i.provider === "vodafone-cash")?.status || "disconnected",
    },
    {
      id: "airteltigo",
      name: "AirtelTigo Money",
      description: "Accept payments via AirtelTigo Money",
      category: "mobile-money",
      icon: "📱",
      status: integrations.find((i: any) => i.provider === "airteltigo")?.status || "disconnected",
    },
  ]

  const governmentIntegrations = [
    {
      id: "gra",
      name: "Ghana Revenue Authority",
      description: "Automated tax filing and compliance",
      category: "government",
      icon: "🏛️",
      status: integrations.find((i: any) => i.provider === "gra")?.status || "disconnected",
    },
    {
      id: "ssnit",
      name: "SSNIT",
      description: "Social Security integration for payroll",
      category: "government",
      icon: "🏛️",
      status: integrations.find((i: any) => i.provider === "ssnit")?.status || "disconnected",
    },
  ]

  const accountingIntegrations = [
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync data with QuickBooks Online",
      category: "accounting",
      icon: "📊",
      status: integrations.find((i: any) => i.provider === "quickbooks")?.status || "disconnected",
    },
    {
      id: "xero",
      name: "Xero",
      description: "Export data to Xero accounting software",
      category: "accounting",
      icon: "📊",
      status: integrations.find((i: any) => i.provider === "xero")?.status || "disconnected",
    },
  ]

  const communicationIntegrations = [
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Send transactional emails and notifications",
      category: "communication",
      icon: "📧",
      status: integrations.find((i: any) => i.provider === "sendgrid")?.status || "disconnected",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Receive notifications in Slack channels",
      category: "communication",
      icon: "💬",
      status: integrations.find((i: any) => i.provider === "slack")?.status || "disconnected",
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
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Image and document storage",
      category: "storage",
      icon: "☁️",
      status: integrations.find((i: any) => i.provider === "cloudinary")?.status || "disconnected",
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
          <h2 className="text-lg font-semibold mb-4">Mobile Money (Ghana)</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mobileMoneyIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Government & Compliance</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {governmentIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Accounting Software</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accountingIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Communication</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communicationIntegrations.map((integration) => (
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
