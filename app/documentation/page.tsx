import Link from 'next/link'
import { ArrowLeft, Book, Code, FileText, Video, Search, ChevronRight, PlayCircle, FileCode, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DocumentationPage() {
  const modules = [
    { 
      title: 'Getting Started', 
      icon: Zap,
      description: 'Quick start guide and setup',
      articles: [
        { title: 'Installation & Setup', time: '5 min' },
        { title: 'First Time Configuration', time: '10 min' },
        { title: 'User Roles & Permissions', time: '8 min' },
      ]
    },
    { 
      title: 'Payroll Management', 
      icon: '💰',
      description: 'Process payroll and manage employees',
      articles: [
        { title: 'Adding Employees', time: '5 min' },
        { title: 'Running Payroll', time: '10 min' },
        { title: 'Tax Calculations', time: '12 min' },
        { title: 'Direct Deposits', time: '8 min' },
      ]
    },
    { 
      title: 'General Ledger', 
      icon: '📊',
      description: 'Manage accounts and transactions',
      articles: [
        { title: 'Chart of Accounts', time: '7 min' },
        { title: 'Journal Entries', time: '10 min' },
        { title: 'Account Reconciliation', time: '15 min' },
        { title: 'Closing Periods', time: '12 min' },
      ]
    },
    { 
      title: 'Invoicing & Billing', 
      icon: '🧾',
      description: 'Create and manage invoices',
      articles: [
        { title: 'Creating Invoices', time: '5 min' },
        { title: 'Payment Terms', time: '6 min' },
        { title: 'Recurring Invoices', time: '8 min' },
        { title: 'Payment Tracking', time: '7 min' },
      ]
    },
    { 
      title: 'Expense Management', 
      icon: '💳',
      description: 'Track and manage expenses',
      articles: [
        { title: 'Recording Expenses', time: '5 min' },
        { title: 'Expense Categories', time: '6 min' },
        { title: 'Receipt Management', time: '8 min' },
        { title: 'Expense Reports', time: '10 min' },
      ]
    },
    { 
      title: 'Financial Reports', 
      icon: '📈',
      description: 'Generate and analyze reports',
      articles: [
        { title: 'Profit & Loss Statement', time: '8 min' },
        { title: 'Balance Sheet', time: '10 min' },
        { title: 'Cash Flow Report', time: '12 min' },
        { title: 'Custom Reports', time: '15 min' },
      ]
    },
    { 
      title: 'Tax Management', 
      icon: '📋',
      description: 'Handle tax compliance',
      articles: [
        { title: 'Tax Setup', time: '10 min' },
        { title: 'Sales Tax', time: '8 min' },
        { title: 'Tax Forms (W-2, 1099)', time: '15 min' },
        { title: 'Tax Filing', time: '12 min' },
      ]
    },
    { 
      title: 'API Integration', 
      icon: Code,
      description: 'Integrate with external systems',
      articles: [
        { title: 'API Authentication', time: '10 min' },
        { title: 'Webhooks', time: '12 min' },
        { title: 'Rate Limits', time: '5 min' },
        { title: 'Error Handling', time: '8 min' },
      ]
    },
  ]

  const quickLinks = [
    { title: 'Video Tutorials', icon: PlayCircle, link: '#' },
    { title: 'API Reference', icon: FileCode, link: '/api-reference' },
    { title: 'Code Examples', icon: Code, link: '#' },
    { title: 'Release Notes', icon: FileText, link: '#' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-foreground/70 mb-8">
            Complete guides and tutorials for PayFlow
          </p>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <Input 
              placeholder="Search documentation..." 
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((link, i) => {
            const Icon = link.icon
            return (
              <Link key={i} href={link.link}>
                <Card className="p-6 hover:border-emerald-500/40 transition-all cursor-pointer text-center">
                  <Icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold">{link.title}</h3>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="space-y-8">
          {modules.map((module, i) => {
            const Icon = typeof module.icon === 'string' ? null : module.icon
            return (
              <Card key={i} className="p-8 hover:border-emerald-500/40 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  {Icon ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Icon className="text-white" size={24} />
                    </div>
                  ) : (
                    <div className="text-4xl">{module.icon}</div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                    <p className="text-foreground/60">{module.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {module.articles.map((article, j) => {
                    const slug = article.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[()]/g, '')
                    return (
                      <Link key={j} href={`/documentation/${slug}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-all group">
                          <div className="flex items-center gap-3">
                            <Book size={16} className="text-emerald-600" />
                            <span className="font-medium group-hover:text-emerald-600 transition-colors">{article.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/60">
                            <span>{article.time}</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-foreground/70 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/support">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                Contact Support
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
