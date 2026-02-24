import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/documentation" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Documentation
        </Link>

        <h1 className="text-5xl font-bold mb-6">Complete User Guide</h1>
        <p className="text-xl text-foreground/70 mb-12">
          Comprehensive guide to using PayFlow accounting software
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">1. Getting Started</h2>
            <h3 className="text-2xl font-bold mb-4">Installation & Setup</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Sign up at payflow.com/sign-up</li>
              <li>Choose your subscription plan</li>
              <li>Complete organization profile</li>
              <li>Set fiscal year and preferences</li>
            </ol>
            <h3 className="text-2xl font-bold mb-4 mt-6">User Roles</h3>
            <ul className="space-y-3 text-foreground/80">
              <li><strong>Admin:</strong> Full system access</li>
              <li><strong>Accountant:</strong> Accounting and reports</li>
              <li><strong>Manager:</strong> View reports, approve expenses</li>
              <li><strong>Employee:</strong> Submit expenses, view pay stubs</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">2. Payroll Management</h2>
            <h3 className="text-2xl font-bold mb-4">Adding Employees</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Navigate to Payroll → Employees</li>
              <li>Click "Add Employee"</li>
              <li>Enter personal information</li>
              <li>Set salary/hourly rate</li>
              <li>Configure tax withholdings</li>
              <li>Add bank account for direct deposit</li>
            </ol>
            <h3 className="text-2xl font-bold mb-4 mt-6">Running Payroll</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Go to Payroll → Run Payroll</li>
              <li>Select pay period</li>
              <li>Review hours/salaries</li>
              <li>Verify tax calculations</li>
              <li>Approve and process</li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">3. General Ledger</h2>
            <h3 className="text-2xl font-bold mb-4">Chart of Accounts</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Assets:</strong> Cash, Accounts Receivable, Inventory</li>
              <li><strong>Liabilities:</strong> Accounts Payable, Loans</li>
              <li><strong>Equity:</strong> Owner's Equity, Retained Earnings</li>
              <li><strong>Revenue:</strong> Sales, Service Income</li>
              <li><strong>Expenses:</strong> Rent, Utilities, Salaries</li>
            </ul>
            <h3 className="text-2xl font-bold mb-4 mt-6">Journal Entries</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Go to Accounting → Journal Entries</li>
              <li>Click "New Entry"</li>
              <li>Enter date and description</li>
              <li>Add debit and credit lines</li>
              <li>Ensure debits = credits</li>
              <li>Save and post</li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">4. Invoicing & Billing</h2>
            <h3 className="text-2xl font-bold mb-4">Creating Invoices</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Navigate to Sales → Invoices</li>
              <li>Click "New Invoice"</li>
              <li>Select customer</li>
              <li>Add line items</li>
              <li>Set payment terms</li>
              <li>Send to customer</li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">5. Expense Management</h2>
            <h3 className="text-2xl font-bold mb-4">Recording Expenses</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Go to Expenses → New Expense</li>
              <li>Select vendor</li>
              <li>Enter amount and date</li>
              <li>Choose category</li>
              <li>Upload receipt</li>
              <li>Submit for approval</li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">6. Financial Reports</h2>
            <ul className="space-y-4 text-foreground/80">
              <li><strong>Profit & Loss:</strong> Revenue and expenses over time</li>
              <li><strong>Balance Sheet:</strong> Assets, liabilities, equity snapshot</li>
              <li><strong>Cash Flow:</strong> Track cash in and out</li>
              <li><strong>Trial Balance:</strong> Verify debits equal credits</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">7. Tax Management</h2>
            <h3 className="text-2xl font-bold mb-4">Tax Setup</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Go to Tax → Settings</li>
              <li>Configure federal tax rates</li>
              <li>Add state and local taxes</li>
              <li>Enable automatic calculations</li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">8. API Integration</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li>Generate API key in Settings</li>
              <li>Use key in Authorization header</li>
              <li>Make requests to api.payflow.com/v1</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}
