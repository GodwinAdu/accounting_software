import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const pricingTiers = [
    { name: 'Starter', price: '$49', description: 'For small businesses', features: ['Up to 10 employees', 'Basic payroll processing', 'Expense tracking', 'Email support', 'Monthly reports'], popular: false },
    { name: 'Professional', price: '$149', description: 'For growing companies', features: ['Up to 100 employees', 'Advanced payroll & accounting', 'Tax compliance', 'Priority support', 'Custom reports', 'API access'], popular: true },
    { name: 'Enterprise', price: 'Custom', description: 'For large organizations', features: ['Unlimited employees', 'Multi-entity support', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option'], popular: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Choose the perfect plan for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, i) => (
            <Card key={i} className={`relative p-8 ${tier.popular ? 'md:scale-105 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/40 shadow-2xl' : 'bg-card/50 border-border/40'}`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-foreground/60 mb-6">{tier.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-foreground/60">/month</span>}
              </div>
              <Button className={`w-full mb-8 h-12 ${tier.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}`} variant={tier.popular ? 'default' : 'outline'} size="lg">
                Get Started
              </Button>
              <div className="space-y-4">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check size={20} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
