import Link from 'next/link'
import { ArrowLeft, DollarSign, Calculator, TrendingUp, Shield, Clock, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FeaturesPage() {
  const features = [
    { icon: DollarSign, title: 'Automated Payroll', description: 'Process payroll in minutes with automated calculations, tax deductions, and direct deposits', color: 'from-emerald-500 to-teal-500' },
    { icon: Calculator, title: 'Smart Accounting', description: 'Real-time bookkeeping with automated reconciliation and financial reporting', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, title: 'Financial Analytics', description: 'Powerful insights with cash flow forecasting, P&L statements, and custom reports', color: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: 'Tax Compliance', description: 'Stay compliant with automatic tax calculations, filings, and year-end reporting', color: 'from-orange-500 to-red-500' },
    { icon: Clock, title: 'Time Tracking', description: 'Integrated time tracking with automatic wage calculations and overtime management', color: 'from-cyan-500 to-blue-500' },
    { icon: FileText, title: 'Expense Management', description: 'Track expenses, manage reimbursements, and maintain complete audit trails', color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to manage payroll and accounting in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="p-8 hover:border-emerald-500/40 transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
