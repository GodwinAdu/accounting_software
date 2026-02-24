import Link from 'next/link'
import { ArrowLeft, Plug } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function IntegrationsPage() {
  const integrations = [
    { name: 'QuickBooks', category: 'Accounting', description: 'Sync your accounting data seamlessly' },
    { name: 'Xero', category: 'Accounting', description: 'Connect with Xero for real-time updates' },
    { name: 'Stripe', category: 'Payments', description: 'Process payments directly' },
    { name: 'PayPal', category: 'Payments', description: 'Accept PayPal payments' },
    { name: 'Square', category: 'Payments', description: 'Integrate with Square POS' },
    { name: 'Gusto', category: 'Payroll', description: 'Sync payroll data' },
    { name: 'ADP', category: 'Payroll', description: 'Connect with ADP systems' },
    { name: 'Salesforce', category: 'CRM', description: 'Sync customer data' },
    { name: 'HubSpot', category: 'CRM', description: 'Integrate with HubSpot' },
    { name: 'Slack', category: 'Communication', description: 'Get notifications in Slack' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-6">Integrations</h1>
        <p className="text-xl text-foreground/70 mb-12">
          Connect PayFlow with your favorite tools and services
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, i) => (
            <Card key={i} className="p-6 hover:border-emerald-500/40 transition-all">
              <div className="flex items-start justify-between mb-4">
                <Plug className="w-8 h-8 text-emerald-600" />
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-600/10 text-emerald-600">{integration.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
              <p className="text-foreground/60 mb-4">{integration.description}</p>
              <Button variant="outline" size="sm" className="w-full">Connect</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
