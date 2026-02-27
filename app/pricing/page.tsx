import Link from 'next/link'
import { ArrowLeft, Check, X, HelpCircle, Zap, Shield, Users, TrendingUp, Clock, DollarSign, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PricingPage() {
  const basePlans = [
    {
      name: 'Starter',
      price: 150,
      description: 'Perfect for small businesses',
      features: [
        'Up to 10 users',
        'Core accounting features',
        'Dashboard & basic reports',
        'Banking & reconciliation',
        'Settings & user management',
        'Email support (48h response)',
        'Mobile app access',
      ],
      popular: false,
      bestFor: 'Small businesses with basic needs'
    },
    {
      name: 'Professional',
      price: 600,
      description: 'For growing companies',
      features: [
        'Up to 100 users',
        'Everything in Starter',
        'Advanced reporting & analytics',
        'Priority support (24h response)',
        'API access',
        'Custom workflows',
        'Multi-user collaboration',
      ],
      popular: true,
      bestFor: 'Growing companies with 10-50 employees'
    },
    {
      name: 'Enterprise',
      price: 0,
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited users',
        'Everything in Professional',
        'Dedicated account manager',
        'Priority support (4h response)',
        '99.9% uptime SLA',
        'Custom integrations & training',
      ],
      popular: false,
      bestFor: 'Large enterprises with 50+ employees'
    },
  ]

  const modules = [
    { key: 'sales', name: 'Sales & Invoicing', price: 30, description: 'Manage invoices, customers, and sales' },
    { key: 'expenses', name: 'Expenses & Bills', price: 25, description: 'Track expenses, bills, and vendors' },
    { key: 'payroll', name: 'Payroll', price: 50, description: 'Employee payroll and time tracking' },
    { key: 'tax', name: 'Tax Management', price: 35, description: 'Tax settings and compliance' },
    { key: 'products', name: 'Products & Inventory', price: 20, description: 'Product catalog and stock management' },
    { key: 'projects', name: 'Projects', price: 25, description: 'Project management and tracking' },
    { key: 'crm', name: 'CRM', price: 30, description: 'Customer relationship management' },
    { key: 'budgeting', name: 'Budgeting', price: 40, description: 'Budget planning and forecasting' },
    { key: 'assets', name: 'Fixed Assets', price: 20, description: 'Asset management and depreciation' },
    { key: 'loans', name: 'Loans', price: 25, description: 'Loan management and tracking' },
    { key: 'equity', name: 'Equity', price: 20, description: 'Equity transactions and owner investments' },
    { key: 'ai', name: 'AI Assistant', price: 150, description: 'AI-powered insights and automation' },
  ]

  const billingPeriods = [
    { months: 1, label: '1 Month', discount: 0 },
    { months: 3, label: '3 Months', discount: 5 },
    { months: 6, label: '6 Months', discount: 10 },
    { months: 12, label: '1 Year', discount: 15 },
  ]

  const faqs = [
    {
      question: 'How does the pricing work?',
      answer: 'Choose a base plan (Starter or Professional), then add only the modules you need. Each module has a fixed monthly price. You only pay for what you use!'
    },
    {
      question: 'What\'s included in the base plan?',
      answer: 'Base plans include core accounting features, dashboard, banking, reconciliation, settings, and user management. Add-on modules provide specialized features like payroll, CRM, and AI.'
    },
    {
      question: 'Can I add or remove modules anytime?',
      answer: 'Yes! Toggle modules on/off in your subscription settings. Changes take effect immediately, and billing is adjusted for the next cycle.'
    },
    {
      question: 'What are the billing period discounts?',
      answer: '3 months: 5% off, 6 months: 10% off, 1 year: 15% off (save almost 2 months). Longer commitments = bigger savings!'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Start with a free trial to explore all features. No credit card required. When ready, select your plan and billing period to upgrade.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, and Ghana mobile money (MTN, Vodafone, AirtelTigo) via Paystack. All payments are secure and encrypted.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes! Upgrade anytime (takes effect immediately). Downgrades apply at the next billing cycle with pro-rated credits for unused time.'
    },
    {
      question: 'What happens if I cancel?',
      answer: 'You can cancel anytime. Access continues until the end of your billing period. Export your data within 30 days before permanent deletion.'
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer: 'Yes! Registered nonprofits and NGOs receive 30% off. Contact sales@syncbooks.com with registration documents to apply.'
    },
    {
      question: 'What\'s the Enterprise plan?',
      answer: 'Enterprise offers custom pricing, unlimited users, dedicated support, SLA guarantees, and custom integrations. Contact sales for a tailored quote.'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include 14-day free trial and 14-day money-back guarantee.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>20% off annual plans</span>
            </div>
          </div>
        </div>

        {/* Base Plans */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Base Plan</h2>
          <p className="text-center text-foreground/60 mb-8 max-w-2xl mx-auto">
            Start with a base plan that includes core accounting features
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {basePlans.map((plan, i) => (
              <Card key={i} className={`relative p-6 flex flex-col ${plan.popular ? 'md:scale-105 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/40 shadow-2xl' : 'bg-card/50 border-border/40'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-foreground/60 text-sm">{plan.description}</p>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price > 0 ? `GHS ${plan.price}` : 'Custom'}</span>
                    {plan.price > 0 && <span className="text-foreground/60">/month</span>}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-sm text-foreground/50 mt-1">${(plan.price / 10).toFixed(0)} USD/month</p>
                  )}
                </div>
                <Button 
                  className={`w-full mb-4 h-12 ${plan.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' : ''}`} 
                  variant={plan.popular ? 'default' : 'outline'} 
                  size="lg"
                >
                  {plan.price === 0 ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
                <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-foreground/70">
                    <strong>Best for:</strong> {plan.bestFor}
                  </p>
                </div>
                <div className="space-y-2 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-on Modules */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Add-on Modules</h2>
          <p className="text-center text-foreground/60 mb-8 max-w-2xl mx-auto">
            Customize your subscription by adding only the modules you need. Pay only for what you use!
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modules.map((module, i) => (
              <Card key={i} className="p-4 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{module.name}</h3>
                  <Badge variant="secondary" className="text-xs">+GHS {module.price}</Badge>
                </div>
                <p className="text-xs text-foreground/60">{module.description}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20 text-center">
            <h3 className="font-semibold mb-2">Example: Professional + 5 Modules</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Base (GHS 600) + Sales (GHS 30) + Expenses (GHS 25) + Payroll (GHS 50) + Tax (GHS 35) + AI (GHS 150)
            </p>
            <p className="text-2xl font-bold text-emerald-600">= GHS 890/month</p>
            <p className="text-xs text-foreground/60 mt-2">Save 15% with annual billing: GHS 9,078/year (GHS 756.50/month)</p>
          </div>
        </div>

        {/* Billing Discounts */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Billing Period Discounts</h2>
          <p className="text-center text-foreground/60 mb-8 max-w-2xl mx-auto">
            Save more with longer billing periods. All discounts apply to your total subscription cost.
          </p>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {billingPeriods.map((period, i) => (
              <Card key={i} className="p-6 text-center">
                <h3 className="font-semibold mb-2">{period.label}</h3>
                {period.discount > 0 ? (
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600">Save {period.discount}%</Badge>
                ) : (
                  <Badge variant="outline">Standard</Badge>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Value Propositions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SyncBooks?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-foreground/60">Get instant financial insights and automate repetitive tasks with AI</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-sm text-foreground/60">AES-256 encryption, 2FA, and secure data storage</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">Team Collaboration</h3>
              <p className="text-sm text-foreground/60">Role-based access, real-time sync, and seamless team workflows</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">Grow With You</h3>
              <p className="text-sm text-foreground/60">Scale from 1 to 1000+ users without switching platforms</p>
            </Card>
          </div>
        </div>



        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">
            Everything you need to know about our pricing and plans
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold">{faq.question}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your business. Get in touch for a personalized demo or consultation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
          <p className="text-sm text-foreground/60 mt-6">
            Email: <a href="mailto:sales@syncbooks.com" className="text-emerald-600 hover:underline">sales@syncbooks.com</a> | 
            Phone: <span className="text-emerald-600">+233 XX XXX XXXX</span>
          </p>
        </Card>
      </div>
    </div>
  )
}
