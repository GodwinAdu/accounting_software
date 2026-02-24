import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/documentation" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Documentation
        </Link>

        <h1 className="text-5xl font-bold mb-6">Getting Started</h1>
        <p className="text-xl text-foreground/70 mb-12">
          Welcome to PayFlow! This guide will help you set up your account and get started.
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">1</span>
              Installation & Setup
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p><strong>Step 1:</strong> Sign up for a PayFlow account at payflow.com/sign-up</p>
              <p><strong>Step 2:</strong> Choose your subscription plan (Starter, Professional, or Enterprise)</p>
              <p><strong>Step 3:</strong> Complete your organization profile with business details</p>
              <p><strong>Step 4:</strong> Set up your fiscal year and accounting preferences</p>
              <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                <p className="text-sm"><strong>💡 Tip:</strong> Have your EIN, business address, and bank account information ready for faster setup.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">2</span>
              First Time Configuration
            </h2>
            <div className="space-y-4 text-foreground/80">
              <h3 className="text-xl font-bold">Chart of Accounts</h3>
              <p>Set up your chart of accounts to track income, expenses, assets, and liabilities.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigate to Accounting → Chart of Accounts</li>
                <li>Use the default template or create custom accounts</li>
                <li>Assign account codes and types</li>
              </ul>

              <h3 className="text-xl font-bold mt-6">Payment Methods</h3>
              <p>Configure how you'll receive and send payments.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connect your bank account for direct deposits</li>
                <li>Set up payment gateways (Stripe, PayPal)</li>
                <li>Configure payment terms and late fees</li>
              </ul>

              <h3 className="text-xl font-bold mt-6">Tax Settings</h3>
              <p>Configure tax rates and compliance settings.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Set up federal, state, and local tax rates</li>
                <li>Configure sales tax for your jurisdiction</li>
                <li>Enable automatic tax calculations</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">3</span>
              User Roles & Permissions
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p>PayFlow offers role-based access control to secure your financial data.</p>
              
              <div className="space-y-4 mt-4">
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h4 className="font-bold">Admin</h4>
                  <p className="text-sm">Full access to all features, settings, and data</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold">Accountant</h4>
                  <p className="text-sm">Access to accounting, reports, and reconciliation</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-bold">Manager</h4>
                  <p className="text-sm">View reports, approve expenses, manage team</p>
                </div>
                <div className="border-l-4 border-orange-600 pl-4">
                  <h4 className="font-bold">Employee</h4>
                  <p className="text-sm">Submit expenses, view pay stubs, update profile</p>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                <p className="text-sm"><strong>🔒 Security:</strong> Always follow the principle of least privilege - grant users only the permissions they need.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-600" size={20} />
                <Link href="/documentation/docs/payroll" className="text-emerald-600 hover:underline">Set up your first employee</Link>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-600" size={20} />
                <Link href="/documentation/docs/invoicing" className="text-emerald-600 hover:underline">Create your first invoice</Link>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-600" size={20} />
                <Link href="/documentation/docs/general-ledger" className="text-emerald-600 hover:underline">Record your first transaction</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
