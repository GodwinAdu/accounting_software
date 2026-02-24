import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SolutionsPage() {
  const modules = [
    { title: 'Payroll Management', icon: '💰', description: 'Automated wage processing', gradient: 'from-emerald-600 to-teal-600' },
    { title: 'General Ledger', icon: '📊', description: 'Complete accounting system', gradient: 'from-blue-600 to-cyan-600' },
    { title: 'Invoicing & Billing', icon: '🧾', description: 'Professional invoices', gradient: 'from-purple-600 to-pink-600' },
    { title: 'Tax Management', icon: '📋', description: 'Automated tax compliance', gradient: 'from-orange-600 to-red-600' },
    { title: 'Employee Portal', icon: '👤', description: 'Self-service for employees', gradient: 'from-cyan-600 to-blue-600' },
    { title: 'Financial Reports', icon: '📈', description: 'Real-time insights', gradient: 'from-indigo-600 to-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Complete Financial Suite</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            All the tools you need to manage your business finances
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {modules.map((module, i) => (
            <Card key={i} className="p-8 hover:border-emerald-500/40 transition-all">
              <div className={`w-20 h-20 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-6 text-5xl shadow-lg`}>
                {module.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
              <p className="text-foreground/60">{module.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
