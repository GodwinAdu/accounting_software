'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useParams } from 'next/navigation'

const articles: Record<string, any> = {
  'installation-setup': {
    title: 'Installation & Setup',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Installation & Setup</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Welcome to PayFlow! Follow these steps to get your account up and running.</p>
            
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Before you start:</strong> Have your EIN, business address, and bank account information ready.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Step 1: Create Your Account</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Visit <a href="/sign-up" className="text-emerald-600 hover:underline">payflow.com/sign-up</a></li>
              <li>Enter your email address and create a strong password</li>
              <li>Verify your email by clicking the link sent to your inbox</li>
              <li>Complete the two-factor authentication setup for added security</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Step 2: Choose Your Plan</h3>
            <p>Select the subscription plan that best fits your business needs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Starter ($49/month):</strong> Perfect for small businesses with up to 10 employees</li>
              <li><strong>Professional ($149/month):</strong> Ideal for growing companies with up to 100 employees</li>
              <li><strong>Enterprise (Custom pricing):</strong> For large organizations with unlimited employees</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Step 3: Complete Organization Profile</h3>
            <p>Provide your business information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Legal business name and DBA (if applicable)</li>
              <li>Business address and contact information</li>
              <li>Employer Identification Number (EIN)</li>
              <li>Business type (LLC, Corporation, Partnership, etc.)</li>
              <li>Industry classification</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Step 4: Set Fiscal Year</h3>
            <p>Configure your accounting period:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose fiscal year start date (typically January 1 or July 1)</li>
              <li>Select accounting method (Cash or Accrual)</li>
              <li>Set default currency (USD, EUR, GBP, etc.)</li>
              <li>Configure time zone for accurate reporting</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Success!</strong> Your account is now set up. Next, configure your chart of accounts and payment methods.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'first-time-configuration': {
    title: 'First Time Configuration',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">First Time Configuration</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Configure essential settings to start using PayFlow effectively.</p>

            <h3 className="text-2xl font-bold mt-8">Chart of Accounts Setup</h3>
            <p>Your chart of accounts is the foundation of your accounting system:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Accounting → Chart of Accounts</strong></li>
              <li>Choose to use the default template or create custom accounts</li>
              <li>Review and customize account categories:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Assets:</strong> Cash (1000), Accounts Receivable (1200), Inventory (1300)</li>
                  <li><strong>Liabilities:</strong> Accounts Payable (2000), Loans (2500)</li>
                  <li><strong>Equity:</strong> Owner's Equity (3000), Retained Earnings (3100)</li>
                  <li><strong>Revenue:</strong> Sales Revenue (4000), Service Income (4100)</li>
                  <li><strong>Expenses:</strong> Salaries (5000), Rent (5100), Utilities (5200)</li>
                </ul>
              </li>
              <li>Assign account codes following standard numbering conventions</li>
              <li>Set account types (Bank, Credit Card, Income, Expense, etc.)</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Payment Methods Configuration</h3>
            <p>Set up how you'll receive and send payments:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Bank Account Connection:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Go to Settings → Payment Methods</li>
                  <li>Click "Connect Bank Account"</li>
                  <li>Enter routing and account numbers</li>
                  <li>Verify with micro-deposits (1-2 business days)</li>
                </ul>
              </li>
              <li><strong>Payment Gateways:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Connect Stripe for credit card processing</li>
                  <li>Link PayPal for online payments</li>
                  <li>Configure Square for POS transactions</li>
                </ul>
              </li>
              <li><strong>Payment Terms:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Set default terms (Net 30, Net 60, Due on Receipt)</li>
                  <li>Configure late fee percentages</li>
                  <li>Set up automatic payment reminders</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Tax Settings</h3>
            <p>Configure tax rates and compliance:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Tax → Settings</strong></li>
              <li>Enter federal tax ID (EIN)</li>
              <li>Set up federal income tax rates</li>
              <li>Add state and local tax jurisdictions</li>
              <li>Configure sales tax rates by location</li>
              <li>Enable automatic tax calculations</li>
              <li>Set tax filing frequency (Monthly, Quarterly, Annual)</li>
            </ol>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Pro Tip:</strong> Consult with your accountant when setting up your chart of accounts to ensure it meets your specific business needs.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'user-roles-permissions': {
    title: 'User Roles & Permissions',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">User Roles & Permissions</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">PayFlow uses role-based access control to protect your financial data.</p>

            <h3 className="text-2xl font-bold mt-8">Available Roles</h3>
            
            <div className="space-y-6 mt-6">
              <div className="border-l-4 border-emerald-600 pl-6 py-4 bg-emerald-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Admin</h4>
                <p className="mb-3">Full system access with all permissions</p>
                <p className="text-sm font-semibold mb-2">Can access:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>All accounting modules and features</li>
                  <li>User management and role assignment</li>
                  <li>Organization settings and configuration</li>
                  <li>Billing and subscription management</li>
                  <li>API keys and integrations</li>
                  <li>Audit logs and security settings</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Accountant</h4>
                <p className="mb-3">Full accounting access without admin privileges</p>
                <p className="text-sm font-semibold mb-2">Can access:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>All accounting transactions and reports</li>
                  <li>Chart of accounts management</li>
                  <li>Journal entries and reconciliation</li>
                  <li>Tax forms and filings</li>
                  <li>Financial reports generation</li>
                  <li>Cannot: Manage users or change organization settings</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-600 pl-6 py-4 bg-purple-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Manager</h4>
                <p className="mb-3">Department-level access for operational management</p>
                <p className="text-sm font-semibold mb-2">Can access:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Create and approve invoices</li>
                  <li>Process expenses and reimbursements</li>
                  <li>Run payroll for their department</li>
                  <li>View financial reports (read-only)</li>
                  <li>Manage team member timesheets</li>
                  <li>Cannot: Modify chart of accounts or tax settings</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Employee</h4>
                <p className="mb-3">Limited access for individual contributors</p>
                <p className="text-sm font-semibold mb-2">Can access:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Submit expense reports</li>
                  <li>View own pay stubs and tax forms</li>
                  <li>Track personal time off</li>
                  <li>Update personal information</li>
                  <li>Cannot: View other employees' data or financial reports</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Managing Users</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Settings → Users</strong></li>
              <li>Click "Invite User" button</li>
              <li>Enter email address and select role</li>
              <li>Set department and reporting manager (optional)</li>
              <li>User receives invitation email with setup link</li>
              <li>User completes profile and 2FA setup</li>
            </ol>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Security Warning:</strong> Always use the principle of least privilege. Only grant users the minimum permissions needed for their role.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'adding-employees': {
    title: 'Adding Employees',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Adding Employees</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Add employees to your PayFlow account to manage payroll and benefits.</p>

            <h3 className="text-2xl font-bold mt-8">Employee Information Required</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Details:</strong> Full legal name, date of birth, SSN</li>
              <li><strong>Contact Info:</strong> Email, phone, home address</li>
              <li><strong>Employment:</strong> Job title, department, start date, employment type</li>
              <li><strong>Compensation:</strong> Salary/hourly rate, pay frequency, overtime eligibility</li>
              <li><strong>Tax Info:</strong> W-4 form, state withholding, local taxes</li>
              <li><strong>Banking:</strong> Direct deposit account and routing numbers</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Step-by-Step Process</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Payroll → Employees</strong></li>
              <li>Click "Add Employee" button</li>
              <li>Fill in personal information form</li>
              <li>Set compensation details and pay schedule</li>
              <li>Upload or enter tax withholding forms (W-4)</li>
              <li>Add direct deposit information</li>
              <li>Assign benefits and deductions</li>
              <li>Review and save employee profile</li>
            </ol>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> Employees can update their own information through the employee portal after initial setup.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'running-payroll': {
    title: 'Running Payroll',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Running Payroll</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Process payroll accurately and on time with PayFlow's automated system.</p>

            <h3 className="text-2xl font-bold mt-8">Payroll Processing Steps</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Review Time Entries:</strong> Verify all employee hours are recorded</li>
              <li><strong>Check Deductions:</strong> Confirm benefits, 401(k), and other deductions</li>
              <li><strong>Preview Payroll:</strong> Review calculated amounts before processing</li>
              <li><strong>Approve Payroll:</strong> Submit for processing (must be done 2 days before payday)</li>
              <li><strong>Direct Deposits:</strong> Funds are transferred on payday</li>
              <li><strong>Pay Stubs:</strong> Automatically generated and emailed to employees</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Sample Payroll Calculation</h3>
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Employee: John Smith</h4>
              <div className="bg-white dark:bg-gray-900 rounded p-6 space-y-4">
                <div>
                  <p className="font-bold text-lg mb-3 text-emerald-600">Earnings</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Regular Hours (80 hrs × $25/hr)</span>
                      <span className="font-mono">$2,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Hours (5 hrs × $37.50/hr)</span>
                      <span className="font-mono">$187.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus</span>
                      <span className="font-mono">$500.00</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Gross Pay</span>
                      <span className="font-mono">$2,687.50</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg mb-3 text-blue-600">Taxes</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Federal Income Tax</span>
                      <span className="font-mono text-red-600">-$322.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Security (6.2%)</span>
                      <span className="font-mono text-red-600">-$166.63</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medicare (1.45%)</span>
                      <span className="font-mono text-red-600">-$38.97</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Income Tax (5%)</span>
                      <span className="font-mono text-red-600">-$134.38</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Taxes</span>
                      <span className="font-mono text-red-600">-$662.48</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg mb-3 text-purple-600">Deductions</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <span className="font-mono text-red-600">-$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>401(k) Contribution (5%)</span>
                      <span className="font-mono text-red-600">-$134.38</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dental Insurance</span>
                      <span className="font-mono text-red-600">-$25.00</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Deductions</span>
                      <span className="font-mono text-red-600">-$309.38</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Net Pay</span>
                    <span className="text-2xl font-bold text-emerald-600 font-mono">$1,715.64</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Employer Costs</h3>
            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-6 my-6">
              <p className="mb-4">In addition to employee's gross pay, employers pay:</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Social Security Match (6.2%)</span>
                  <span className="font-mono">$166.63</span>
                </div>
                <div className="flex justify-between">
                  <span>Medicare Match (1.45%)</span>
                  <span className="font-mono">$38.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Unemployment (FUTA)</span>
                  <span className="font-mono">$42.00</span>
                </div>
                <div className="flex justify-between">
                  <span>State Unemployment (SUTA)</span>
                  <span className="font-mono">$80.63</span>
                </div>
                <div className="flex justify-between">
                  <span>Workers' Compensation</span>
                  <span className="font-mono">$53.75</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base">
                  <span>Total Employer Taxes</span>
                  <span className="font-mono">$381.98</span>
                </div>
                <div className="flex justify-between font-bold border-t-2 pt-2 text-lg">
                  <span>Total Cost to Employer</span>
                  <span className="font-mono text-blue-600">$3,069.48</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Payroll Schedule Options</h3>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Weekly</h4>
                <p className="text-sm mb-2">52 pay periods per year</p>
                <p className="text-sm text-emerald-600">Best for: Hourly employees, construction</p>
              </div>
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Bi-weekly</h4>
                <p className="text-sm mb-2">26 pay periods per year</p>
                <p className="text-sm text-blue-600">Best for: Most common, easy to calculate</p>
              </div>
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Semi-monthly</h4>
                <p className="text-sm mb-2">24 pay periods per year (1st and 15th)</p>
                <p className="text-sm text-purple-600">Best for: Salaried employees</p>
              </div>
              <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Monthly</h4>
                <p className="text-sm mb-2">12 pay periods per year</p>
                <p className="text-sm text-orange-600">Best for: Executives, international</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Off-Cycle Payroll</h3>
            <p>For bonuses, commissions, or corrections:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to <strong>Payroll → Off-Cycle</strong></li>
              <li>Select employees to include</li>
              <li>Enter payment amounts and types</li>
              <li>Choose payment date</li>
              <li>Submit for processing</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Payroll Checklist</h3>
            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Verify all time entries are approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Review any changes to employee information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Check for new hires or terminations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Confirm benefit deductions are correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Verify sufficient funds in bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Submit payroll 2 business days before payday</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Automated:</strong> PayFlow automatically calculates federal, state, and local taxes for each payroll run.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'tax-calculations': {
    title: 'Tax Calculations',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Tax Calculations</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">PayFlow automatically calculates and withholds all required payroll taxes.</p>

            <h3 className="text-2xl font-bold mt-8">Federal Taxes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Federal Income Tax:</strong> Based on W-4 withholding allowances</li>
              <li><strong>Social Security:</strong> 6.2% (employee) + 6.2% (employer) up to wage base</li>
              <li><strong>Medicare:</strong> 1.45% (employee) + 1.45% (employer)</li>
              <li><strong>Additional Medicare:</strong> 0.9% on wages over $200,000</li>
              <li><strong>FUTA:</strong> 6% on first $7,000 (employer only)</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">State and Local Taxes</h3>
            <p>Automatically calculated based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Employee work location</li>
              <li>State withholding certificates</li>
              <li>State unemployment insurance (SUI) rates</li>
              <li>Local income taxes (if applicable)</li>
              <li>State disability insurance (SDI) where required</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Tax Filing Schedule</h3>
            <p>PayFlow handles all tax deposits and filings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Federal Deposits:</strong> Semi-weekly or monthly (based on deposit schedule)</li>
              <li><strong>Form 941:</strong> Quarterly federal tax return</li>
              <li><strong>Form 940:</strong> Annual FUTA return</li>
              <li><strong>State Returns:</strong> Quarterly or monthly (varies by state)</li>
              <li><strong>Year-End Forms:</strong> W-2s and 1099s by January 31</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tax Guarantee:</strong> PayFlow guarantees accurate tax calculations and assumes liability for any calculation errors.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'direct-deposits': {
    title: 'Direct Deposits',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Direct Deposits</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Set up direct deposit to pay employees electronically and securely.</p>

            <h3 className="text-2xl font-bold mt-8">Setting Up Direct Deposit</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Company Bank Account:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Go to Settings → Banking</li>
                  <li>Add your business checking account</li>
                  <li>Verify with micro-deposits (1-2 days)</li>
                </ul>
              </li>
              <li><strong>Employee Accounts:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Employees enter banking info in their portal</li>
                  <li>Or upload voided check during onboarding</li>
                  <li>Support for multiple accounts (split deposits)</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Direct Deposit Timeline</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>2 Business Days Before Payday:</strong> Submit payroll</li>
              <li><strong>1 Business Day Before:</strong> Funds debited from company account</li>
              <li><strong>Payday:</strong> Funds available in employee accounts by 9 AM</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Split Deposits</h3>
            <p>Employees can split their pay across multiple accounts:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fixed dollar amount to savings</li>
              <li>Percentage to checking</li>
              <li>Remainder to another account</li>
              <li>Up to 3 accounts per employee</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Secure:</strong> All banking information is encrypted and PCI-DSS compliant.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'chart-of-accounts': {
    title: 'Chart of Accounts',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Chart of Accounts</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">The chart of accounts is the backbone of your accounting system.</p>

            <h3 className="text-2xl font-bold mt-8">Account Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Assets (1000-1999):</strong> What your business owns</li>
              <li><strong>Liabilities (2000-2999):</strong> What your business owes</li>
              <li><strong>Equity (3000-3999):</strong> Owner's stake in the business</li>
              <li><strong>Revenue (4000-4999):</strong> Income from sales and services</li>
              <li><strong>Expenses (5000-5999):</strong> Costs of running the business</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Account Structure Examples</h3>
            
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Assets (1000-1999)</h4>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <p className="font-bold text-emerald-600">1000 - Cash & Bank Accounts</p>
                  <p className="pl-6">1010 - Checking Account</p>
                  <p className="pl-6">1020 - Savings Account</p>
                  <p className="pl-6">1030 - Petty Cash</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-600">1200 - Accounts Receivable</p>
                  <p className="pl-6">1210 - Trade Receivables</p>
                  <p className="pl-6">1220 - Employee Advances</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-600">1500 - Fixed Assets</p>
                  <p className="pl-6">1510 - Equipment</p>
                  <p className="pl-6">1520 - Vehicles</p>
                  <p className="pl-6">1530 - Furniture & Fixtures</p>
                  <p className="pl-6">1590 - Accumulated Depreciation</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Liabilities (2000-2999)</h4>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <p className="font-bold text-blue-600">2000 - Accounts Payable</p>
                  <p className="pl-6">2010 - Trade Payables</p>
                  <p className="pl-6">2020 - Accrued Expenses</p>
                </div>
                <div>
                  <p className="font-bold text-blue-600">2100 - Credit Cards</p>
                  <p className="pl-6">2110 - Business Credit Card</p>
                  <p className="pl-6">2120 - Corporate Amex</p>
                </div>
                <div>
                  <p className="font-bold text-blue-600">2500 - Long-term Liabilities</p>
                  <p className="pl-6">2510 - Bank Loan</p>
                  <p className="pl-6">2520 - Equipment Financing</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Revenue (4000-4999)</h4>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <p className="font-bold text-purple-600">4000 - Sales Revenue</p>
                  <p className="pl-6">4010 - Product Sales</p>
                  <p className="pl-6">4020 - Service Revenue</p>
                  <p className="pl-6">4030 - Subscription Revenue</p>
                </div>
                <div>
                  <p className="font-bold text-purple-600">4500 - Other Income</p>
                  <p className="pl-6">4510 - Interest Income</p>
                  <p className="pl-6">4520 - Consulting Fees</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Expenses (5000-5999)</h4>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <p className="font-bold text-orange-600">5000 - Operating Expenses</p>
                  <p className="pl-6">5010 - Salaries & Wages</p>
                  <p className="pl-6">5020 - Payroll Taxes</p>
                  <p className="pl-6">5030 - Employee Benefits</p>
                </div>
                <div>
                  <p className="font-bold text-orange-600">5100 - Office Expenses</p>
                  <p className="pl-6">5110 - Rent</p>
                  <p className="pl-6">5120 - Utilities</p>
                  <p className="pl-6">5130 - Office Supplies</p>
                  <p className="pl-6">5140 - Internet & Phone</p>
                </div>
                <div>
                  <p className="font-bold text-orange-600">5500 - Marketing & Sales</p>
                  <p className="pl-6">5510 - Advertising</p>
                  <p className="pl-6">5520 - Website & SEO</p>
                  <p className="pl-6">5530 - Trade Shows</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Creating Hierarchy Accounts</h3>
            <p>Organize accounts in parent-child relationships for detailed tracking:</p>

            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <h4 className="text-lg font-bold mb-4">Step 1: Create Parent Account</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Go to <strong>Accounting → Chart of Accounts</strong></li>
                <li>Click "Add Account"</li>
                <li>Select account type: <strong>Expense</strong></li>
                <li>Account number: <strong>5100</strong></li>
                <li>Account name: <strong>Office Expenses</strong></li>
                <li>Check "This is a parent account"</li>
                <li>Save account</li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <h4 className="text-lg font-bold mb-4">Step 2: Create Sub-Accounts</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Click "Add Account" again</li>
                <li>Select account type: <strong>Expense</strong></li>
                <li>Account number: <strong>5110</strong></li>
                <li>Account name: <strong>Rent</strong></li>
                <li>Select parent account: <strong>5100 - Office Expenses</strong></li>
                <li>Save account</li>
                <li>Repeat for other sub-accounts (5120 - Utilities, 5130 - Office Supplies)</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold mt-8">Hierarchy Benefits</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Organized Reporting:</strong> View totals by parent category</li>
              <li><strong>Detailed Tracking:</strong> Track specific expenses within categories</li>
              <li><strong>Flexible Analysis:</strong> Drill down from summary to detail</li>
              <li><strong>Clean Structure:</strong> Keep chart of accounts organized</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Numbering Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Leave gaps between numbers (5100, 5200, 5300) for future accounts</li>
              <li>Use increments of 10 for sub-accounts (5110, 5120, 5130)</li>
              <li>Parent accounts end in 00 (5100, 5200)</li>
              <li>Sub-accounts use parent prefix (5100 → 5110, 5120, 5130)</li>
              <li>Maximum 3-4 hierarchy levels to avoid complexity</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Real-World Example</h3>
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 my-6">
              <p className="font-bold mb-3">Scenario: Track marketing expenses by channel</p>
              <div className="font-mono text-sm space-y-1">
                <p className="font-bold text-emerald-600">5500 - Marketing & Sales (Parent)</p>
                <p className="pl-6">5510 - Digital Marketing (Sub-parent)</p>
                <p className="pl-12">5511 - Google Ads</p>
                <p className="pl-12">5512 - Facebook Ads</p>
                <p className="pl-12">5513 - LinkedIn Ads</p>
                <p className="pl-6">5520 - Content Marketing (Sub-parent)</p>
                <p className="pl-12">5521 - Blog Writing</p>
                <p className="pl-12">5522 - Video Production</p>
                <p className="pl-6">5530 - Events & Trade Shows</p>
              </div>
              <p className="mt-4 text-sm"><strong>Result:</strong> View total marketing spend (5500) or drill down to specific channels</p>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Pro Tip:</strong> Start with fewer accounts and add sub-accounts as your business grows and reporting needs become more specific.</p>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Warning:</strong> Cannot delete accounts with transaction history. Mark as inactive instead.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'journal-entries': {
    title: 'Journal Entries',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Journal Entries</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Record manual accounting transactions with journal entries.</p>

            <h3 className="text-2xl font-bold mt-8">When to Use Journal Entries</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adjusting entries at period end</li>
              <li>Depreciation and amortization</li>
              <li>Accruals and deferrals</li>
              <li>Correcting errors</li>
              <li>Reclassifying transactions</li>
              <li>Recording non-cash transactions</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Creating a Journal Entry</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Accounting → Journal Entries</strong></li>
              <li>Click "New Entry"</li>
              <li>Enter entry date and reference number</li>
              <li>Add description/memo</li>
              <li>Add debit line items with accounts and amounts</li>
              <li>Add credit line items with accounts and amounts</li>
              <li>Verify debits equal credits</li>
              <li>Attach supporting documents (optional)</li>
              <li>Save or post entry</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Double-Entry Accounting</h3>
            <p>Every transaction affects at least two accounts:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Debits:</strong> Increase assets and expenses, decrease liabilities and revenue</li>
              <li><strong>Credits:</strong> Increase liabilities and revenue, decrease assets and expenses</li>
              <li><strong>Balance:</strong> Total debits must always equal total credits</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Common Journal Entry Examples</h3>

            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Example 1: Recording Depreciation</h4>
              <p className="mb-3"><strong>Scenario:</strong> Monthly depreciation of $500 on equipment</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4 font-bold border-b pb-2 mb-2">
                  <div>Account</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>5800 - Depreciation Expense</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">-</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>1590 - Accumulated Depreciation</div>
                  <div className="text-right">-</div>
                  <div className="text-right">$500.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4 font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">$500.00</div>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>Effect:</strong> Increases expense (reduces profit) and reduces asset value</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Example 2: Accruing Expenses</h4>
              <p className="mb-3"><strong>Scenario:</strong> Accruing $2,000 in unpaid utilities at month-end</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4 font-bold border-b pb-2 mb-2">
                  <div>Account</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>5120 - Utilities Expense</div>
                  <div className="text-right">$2,000.00</div>
                  <div className="text-right">-</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>2020 - Accrued Expenses</div>
                  <div className="text-right">-</div>
                  <div className="text-right">$2,000.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4 font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div className="text-right">$2,000.00</div>
                  <div className="text-right">$2,000.00</div>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>Effect:</strong> Records expense in correct period and creates liability</p>
            </div>

            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Example 3: Prepaid Expense Adjustment</h4>
              <p className="mb-3"><strong>Scenario:</strong> Converting $1,200 prepaid insurance to expense (1 month)</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4 font-bold border-b pb-2 mb-2">
                  <div>Account</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>5400 - Insurance Expense</div>
                  <div className="text-right">$1,200.00</div>
                  <div className="text-right">-</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>1400 - Prepaid Insurance</div>
                  <div className="text-right">-</div>
                  <div className="text-right">$1,200.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4 font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div className="text-right">$1,200.00</div>
                  <div className="text-right">$1,200.00</div>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>Effect:</strong> Converts asset to expense as insurance coverage is used</p>
            </div>

            <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Example 4: Correcting an Error</h4>
              <p className="mb-3"><strong>Scenario:</strong> $500 expense was recorded to wrong account</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4 font-bold border-b pb-2 mb-2">
                  <div>Account</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>5510 - Advertising (Correct)</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">-</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>5130 - Office Supplies (Wrong)</div>
                  <div className="text-right">-</div>
                  <div className="text-right">$500.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4 font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">$500.00</div>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>Effect:</strong> Reclassifies expense to correct account without changing total expenses</p>
            </div>

            <div className="bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Example 5: Owner Investment</h4>
              <p className="mb-3"><strong>Scenario:</strong> Owner invests $10,000 cash into business</p>
              <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4 font-bold border-b pb-2 mb-2">
                  <div>Account</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>1010 - Checking Account</div>
                  <div className="text-right">$10,000.00</div>
                  <div className="text-right">-</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div>3000 - Owner's Equity</div>
                  <div className="text-right">-</div>
                  <div className="text-right">$10,000.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4 font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div className="text-right">$10,000.00</div>
                  <div className="text-right">$10,000.00</div>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>Effect:</strong> Increases cash asset and owner's equity</p>
            </div>

            <h3 className="text-2xl font-bold mt-8">Debit and Credit Rules</h3>
            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-emerald-600">DEBIT increases:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Assets</li>
                    <li>Expenses</li>
                    <li>Dividends/Draws</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-600">CREDIT increases:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Liabilities</li>
                    <li>Equity</li>
                    <li>Revenue</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> Use recurring journal entries for monthly depreciation or other regular adjustments.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'account-reconciliation': {
    title: 'Account Reconciliation',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Account Reconciliation</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Match your accounting records with bank statements to ensure accuracy.</p>

            <h3 className="text-2xl font-bold mt-8">Reconciliation Process</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Start Reconciliation:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Go to Accounting → Reconcile</li>
                  <li>Select account to reconcile</li>
                  <li>Enter statement ending date and balance</li>
                </ul>
              </li>
              <li><strong>Match Transactions:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Check off cleared transactions</li>
                  <li>PayFlow auto-matches imported transactions</li>
                  <li>Add missing transactions</li>
                </ul>
              </li>
              <li><strong>Resolve Differences:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Investigate unmatched items</li>
                  <li>Correct errors or duplicates</li>
                  <li>Add bank fees or interest</li>
                </ul>
              </li>
              <li><strong>Complete Reconciliation:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Verify difference is $0.00</li>
                  <li>Save and lock reconciliation</li>
                  <li>Generate reconciliation report</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Reconciliation Example</h3>
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 my-6">
              <h4 className="text-xl font-bold mb-4">Business Checking Account - January 2024</h4>
              <div className="bg-white dark:bg-gray-900 rounded p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-bold text-emerald-600 mb-3">PayFlow Balance</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Beginning Balance</span>
                        <span className="font-mono">$25,430.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>+ Deposits</span>
                        <span className="font-mono text-emerald-600">$15,200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Payments</span>
                        <span className="font-mono text-red-600">-$12,850.00</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Ending Balance</span>
                        <span className="font-mono">$27,780.00</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600 mb-3">Bank Statement</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Beginning Balance</span>
                        <span className="font-mono">$25,430.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>+ Deposits</span>
                        <span className="font-mono text-emerald-600">$15,200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Checks/Debits</span>
                        <span className="font-mono text-red-600">-$12,875.00</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Ending Balance</span>
                        <span className="font-mono">$27,755.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
                  <p className="font-bold text-red-600 mb-2">Difference: $25.00</p>
                  <p className="text-sm">PayFlow shows $27,780.00 but bank shows $27,755.00</p>
                </div>

                <div>
                  <p className="font-bold mb-3">Investigation:</p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4 space-y-2 text-sm">
                    <p>✓ Found: Bank service fee of $25.00 not recorded in PayFlow</p>
                    <p>✓ Action: Add bank fee transaction</p>
                    <p className="font-mono">Debit: Bank Fees $25.00 | Credit: Checking $25.00</p>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded p-4">
                  <p className="font-bold text-emerald-600 mb-2">✓ Reconciled!</p>
                  <p className="text-sm">New PayFlow balance: $27,755.00 matches bank statement</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Common Reconciliation Issues</h3>
            <div className="space-y-4 my-6">
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Outstanding Checks</h4>
                <p className="text-sm mb-2">Checks written but not yet cashed</p>
                <p className="text-sm text-blue-600">Solution: Mark as uncleared, will reconcile next month</p>
              </div>
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Deposits in Transit</h4>
                <p className="text-sm mb-2">Deposits recorded but not yet in bank</p>
                <p className="text-sm text-purple-600">Solution: Mark as uncleared, will appear on next statement</p>
              </div>
              <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Bank Fees</h4>
                <p className="text-sm mb-2">Service charges, wire fees, overdraft fees</p>
                <p className="text-sm text-orange-600">Solution: Add as expense transaction</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Interest Income</h4>
                <p className="text-sm mb-2">Interest earned on account</p>
                <p className="text-sm text-emerald-600">Solution: Add as income transaction</p>
              </div>
              <div className="bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Duplicate Entries</h4>
                <p className="text-sm mb-2">Same transaction recorded twice</p>
                <p className="text-sm text-pink-600">Solution: Delete or void duplicate transaction</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Reconciliation Frequency</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bank Accounts:</strong> Monthly (required)</li>
              <li><strong>Credit Cards:</strong> Monthly (recommended)</li>
              <li><strong>Loan Accounts:</strong> Monthly or quarterly</li>
              <li><strong>Investment Accounts:</strong> Quarterly</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Reconciliation Tips</h3>
            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Reconcile within 10 days of receiving statement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Start with largest transactions first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Look for transposed numbers (e.g., $123 vs $132)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Check for missing decimal points</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Review previous month's outstanding items</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
                  <span>Save reconciliation reports for audit trail</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Best Practice:</strong> Reconcile accounts within 10 days of receiving statements for accurate financial reporting.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'closing-periods': {
    title: 'Closing Periods',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Closing Periods</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Lock accounting periods to prevent changes to historical data.</p>

            <h3 className="text-2xl font-bold mt-8">Period Close Checklist</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Complete all bank reconciliations</li>
              <li>Review and approve all transactions</li>
              <li>Post adjusting journal entries</li>
              <li>Run financial reports for the period</li>
              <li>Review for errors or anomalies</li>
              <li>Generate and file tax returns (if applicable)</li>
              <li>Close the period in PayFlow</li>
              <li>Backup accounting data</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Closing a Period</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Accounting → Close Period</strong></li>
              <li>Select period to close (month, quarter, or year)</li>
              <li>Review pre-close checklist</li>
              <li>Confirm all items are complete</li>
              <li>Click "Close Period"</li>
              <li>Enter password to confirm</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">After Closing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Closed periods are locked from editing</li>
              <li>Reports for closed periods remain accessible</li>
              <li>Admins can reopen periods if needed</li>
              <li>Audit log tracks all period close/reopen actions</li>
            </ul>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Important:</strong> Reopening closed periods may affect filed tax returns. Consult your accountant before reopening.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'creating-invoices': {
    title: 'Creating Invoices',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Creating Invoices</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Generate professional invoices and get paid faster.</p>

            <h3 className="text-2xl font-bold mt-8">Invoice Creation Steps</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Invoicing → New Invoice</strong></li>
              <li>Select or create customer</li>
              <li>Set invoice date and due date</li>
              <li>Add line items (products/services)</li>
              <li>Enter quantities and prices</li>
              <li>Apply discounts (if applicable)</li>
              <li>Add taxes automatically</li>
              <li>Include payment terms and notes</li>
              <li>Preview and send invoice</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Invoice Example</h3>
            <div className="bg-white dark:bg-gray-900 border-2 rounded-lg p-8 my-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-2xl font-bold text-emerald-600">INVOICE</h4>
                  <p className="text-sm mt-2">Invoice #: INV-2024-001</p>
                  <p className="text-sm">Date: January 15, 2024</p>
                  <p className="text-sm">Due: February 14, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Your Company Name</p>
                  <p className="text-sm">123 Business St</p>
                  <p className="text-sm">City, ST 12345</p>
                  <p className="text-sm">contact@company.com</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="font-bold mb-2">Bill To:</p>
                <p>Acme Corporation</p>
                <p className="text-sm">456 Client Ave</p>
                <p className="text-sm">City, ST 67890</p>
              </div>

              <table className="w-full mb-6">
                <thead className="border-b-2">
                  <tr className="text-left">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Rate</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3">Website Design Services</td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">$5,000.00</td>
                    <td className="py-3 text-right">$5,000.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Monthly Hosting (12 months)</td>
                    <td className="py-3 text-center">12</td>
                    <td className="py-3 text-right">$50.00</td>
                    <td className="py-3 text-right">$600.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">SEO Optimization</td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">$1,200.00</td>
                    <td className="py-3 text-right">$1,200.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>$6,800.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Discount (10%):</span>
                    <span className="text-red-600">-$680.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax (8.5%):</span>
                    <span>$520.20</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-emerald-600">$6,640.20</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm font-bold mb-2">Payment Terms:</p>
                <p className="text-sm">Net 30 - Payment due within 30 days</p>
                <p className="text-sm mt-4 font-bold">Payment Methods:</p>
                <p className="text-sm">Bank Transfer, Credit Card, PayPal</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Line Item Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Clear Descriptions:</strong> Be specific about what you're charging for</li>
              <li><strong>Itemize Services:</strong> Break down complex projects into line items</li>
              <li><strong>Include Details:</strong> Add dates, hours, or specifications</li>
              <li><strong>Group Similar Items:</strong> Use categories for better organization</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Discount Types</h3>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Percentage Discount</h4>
                <p className="text-sm mb-2">Apply % off total or line item</p>
                <p className="text-sm font-mono">Example: 10% off = $1,000 → $900</p>
              </div>
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Fixed Amount Discount</h4>
                <p className="text-sm mb-2">Subtract fixed dollar amount</p>
                <p className="text-sm font-mono">Example: $100 off = $1,000 → $900</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Invoice Customization</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Add company logo and branding</li>
              <li>Customize colors and fonts</li>
              <li>Include custom fields</li>
              <li>Add payment instructions</li>
              <li>Attach files or documents</li>
              <li>Set invoice numbering format</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Sending Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email:</strong> Send directly from PayFlow</li>
              <li><strong>PDF:</strong> Download and send manually</li>
              <li><strong>Print:</strong> Mail physical copies</li>
              <li><strong>Link:</strong> Share secure payment link</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Professional Invoice Tips</h3>
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-6 my-6">
              <ul className="space-y-2">
                <li>✓ Use sequential invoice numbers (INV-2024-001, INV-2024-002)</li>
                <li>✓ Include clear payment terms and due dates</li>
                <li>✓ Add late payment fees policy</li>
                <li>✓ Provide multiple payment options</li>
                <li>✓ Include contact information for questions</li>
                <li>✓ Add thank you message for professionalism</li>
              </ul>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Pro Tip:</strong> Enable online payments to get paid 3x faster than traditional invoices.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'payment-terms': {
    title: 'Payment Terms',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Payment Terms</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Set clear payment expectations with your customers.</p>

            <h3 className="text-2xl font-bold mt-8">Common Payment Terms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Due on Receipt:</strong> Payment expected immediately</li>
              <li><strong>Net 15:</strong> Payment due within 15 days</li>
              <li><strong>Net 30:</strong> Payment due within 30 days (most common)</li>
              <li><strong>Net 60:</strong> Payment due within 60 days</li>
              <li><strong>Net 90:</strong> Payment due within 90 days</li>
              <li><strong>2/10 Net 30:</strong> 2% discount if paid within 10 days, otherwise due in 30</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Setting Default Terms</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Settings → Invoicing</strong></li>
              <li>Select default payment terms</li>
              <li>Set late fee percentage (optional)</li>
              <li>Configure grace period before late fees</li>
              <li>Enable automatic payment reminders</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Customer-Specific Terms</h3>
            <p>Override defaults for individual customers:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Go to customer profile</li>
              <li>Edit payment terms</li>
              <li>Set custom late fee rules</li>
              <li>Configure reminder schedule</li>
            </ol>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> Offer early payment discounts to improve cash flow.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'recurring-invoices': {
    title: 'Recurring Invoices',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Recurring Invoices</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Automate invoicing for subscription or regular services.</p>

            <h3 className="text-2xl font-bold mt-8">Setting Up Recurring Invoices</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Create a new invoice as normal</li>
              <li>Click "Make Recurring"</li>
              <li>Set frequency:
                <ul className="list-disc pl-6 mt-2">
                  <li>Daily, Weekly, Bi-weekly</li>
                  <li>Monthly, Quarterly, Annually</li>
                  <li>Custom interval</li>
                </ul>
              </li>
              <li>Choose start date</li>
              <li>Set end date or number of occurrences (optional)</li>
              <li>Configure auto-send settings</li>
              <li>Save recurring schedule</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Recurring Invoice Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic generation on schedule</li>
              <li>Auto-send via email</li>
              <li>Auto-charge saved payment methods</li>
              <li>Automatic payment reminders</li>
              <li>Pause or cancel anytime</li>
              <li>Edit future invoices in series</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Managing Recurring Invoices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>View all recurring schedules in one place</li>
              <li>Edit pricing or line items</li>
              <li>Skip individual occurrences</li>
              <li>Change frequency or end date</li>
              <li>Track payment success rates</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Time Saver:</strong> Recurring invoices save an average of 5 hours per month on billing tasks.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'payment-tracking': {
    title: 'Payment Tracking',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Payment Tracking</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Monitor invoice payments and manage accounts receivable.</p>

            <h3 className="text-2xl font-bold mt-8">Recording Payments</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Invoicing → Invoices</strong></li>
              <li>Find the invoice to mark as paid</li>
              <li>Click "Record Payment"</li>
              <li>Enter payment amount and date</li>
              <li>Select payment method</li>
              <li>Add reference number (check #, transaction ID)</li>
              <li>Save payment</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Payment Status</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Draft:</strong> Invoice not yet sent</li>
              <li><strong>Sent:</strong> Invoice sent, awaiting payment</li>
              <li><strong>Viewed:</strong> Customer opened the invoice</li>
              <li><strong>Partial:</strong> Partially paid</li>
              <li><strong>Paid:</strong> Fully paid</li>
              <li><strong>Overdue:</strong> Past due date</li>
              <li><strong>Void:</strong> Cancelled invoice</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Aging Reports</h3>
            <p>Track outstanding invoices by age:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Current (0-30 days)</li>
              <li>31-60 days overdue</li>
              <li>61-90 days overdue</li>
              <li>90+ days overdue</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Payment Reminders</h3>
            <p>Automated reminder schedule:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>3 days before due date</li>
              <li>On due date</li>
              <li>3 days after due date</li>
              <li>7 days after due date</li>
              <li>Custom reminder intervals</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Insight:</strong> Automatic reminders increase on-time payments by 40%.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'recording-expenses': {
    title: 'Recording Expenses',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Recording Expenses</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Track all business expenses for accurate financial reporting and tax deductions.</p>

            <h3 className="text-2xl font-bold mt-8">Manual Expense Entry</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Expenses → New Expense</strong></li>
              <li>Enter expense date</li>
              <li>Select vendor/merchant</li>
              <li>Choose expense category</li>
              <li>Enter amount</li>
              <li>Select payment method</li>
              <li>Add description/memo</li>
              <li>Upload receipt image</li>
              <li>Mark as billable (if applicable)</li>
              <li>Save expense</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Automated Expense Tracking</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bank Feeds:</strong> Auto-import from connected accounts</li>
              <li><strong>Credit Cards:</strong> Sync transactions automatically</li>
              <li><strong>Receipt Scanning:</strong> Mobile app captures receipt data</li>
              <li><strong>Email Forwarding:</strong> Forward receipts to expenses@payflow.com</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Expense Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Office supplies and equipment</li>
              <li>Travel and meals</li>
              <li>Utilities and rent</li>
              <li>Professional services</li>
              <li>Marketing and advertising</li>
              <li>Insurance and taxes</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tax Ready:</strong> All expenses are automatically categorized for tax reporting.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'expense-categories': {
    title: 'Expense Categories',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Expense Categories</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Organize expenses into categories for better tracking and reporting.</p>

            <h3 className="text-2xl font-bold mt-8">Default Categories</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Advertising & Marketing:</strong> Ads, promotions, website</li>
              <li><strong>Auto & Travel:</strong> Mileage, parking, lodging</li>
              <li><strong>Bank Fees:</strong> Service charges, wire fees</li>
              <li><strong>Equipment:</strong> Computers, machinery, tools</li>
              <li><strong>Insurance:</strong> Business, liability, health</li>
              <li><strong>Legal & Professional:</strong> Attorneys, accountants, consultants</li>
              <li><strong>Office Supplies:</strong> Paper, pens, software</li>
              <li><strong>Rent & Utilities:</strong> Office space, electricity, internet</li>
              <li><strong>Salaries & Wages:</strong> Employee compensation</li>
              <li><strong>Taxes:</strong> Property, sales, payroll taxes</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Creating Custom Categories</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Settings → Expense Categories</strong></li>
              <li>Click "Add Category"</li>
              <li>Enter category name</li>
              <li>Select parent category (optional)</li>
              <li>Assign tax form line item</li>
              <li>Set as active/inactive</li>
              <li>Save category</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Category Rules</h3>
            <p>Automatically categorize expenses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set rules based on vendor name</li>
              <li>Auto-categorize by amount range</li>
              <li>Use keywords in descriptions</li>
              <li>Learn from past categorizations</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> Use sub-categories to track specific expense types within broader categories.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'receipt-management': {
    title: 'Receipt Management',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Receipt Management</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Digitize and organize receipts for audit-proof record keeping.</p>

            <h3 className="text-2xl font-bold mt-8">Capturing Receipts</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Mobile App:</strong> Take photo with smartphone camera</li>
              <li><strong>Email:</strong> Forward receipts to expenses@payflow.com</li>
              <li><strong>Upload:</strong> Drag and drop files in web app</li>
              <li><strong>Scanner:</strong> Scan paper receipts to PDF</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">OCR Technology</h3>
            <p>PayFlow automatically extracts:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Merchant name and address</li>
              <li>Transaction date and time</li>
              <li>Total amount and tax</li>
              <li>Payment method</li>
              <li>Line items and quantities</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Receipt Storage</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unlimited cloud storage</li>
              <li>Encrypted and secure</li>
              <li>Searchable by date, vendor, amount</li>
              <li>Accessible from any device</li>
              <li>IRS-compliant digital records</li>
              <li>7-year retention policy</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Receipt Matching</h3>
            <p>Automatically match receipts to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bank transactions</li>
              <li>Credit card charges</li>
              <li>Expense reports</li>
              <li>Vendor bills</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Audit Ready:</strong> Digital receipts are IRS-approved and eliminate paper storage needs.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'expense-reports': {
    title: 'Expense Reports',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Expense Reports</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Create and submit expense reports for reimbursement approval.</p>

            <h3 className="text-2xl font-bold mt-8">Creating Expense Reports</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Expenses → Reports</strong></li>
              <li>Click "New Report"</li>
              <li>Enter report name and purpose</li>
              <li>Select date range</li>
              <li>Add expenses to report</li>
              <li>Attach receipts</li>
              <li>Add notes or explanations</li>
              <li>Submit for approval</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Approval Workflow</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Submitted:</strong> Report sent to manager</li>
              <li><strong>Under Review:</strong> Manager reviewing expenses</li>
              <li><strong>Approved:</strong> Ready for reimbursement</li>
              <li><strong>Rejected:</strong> Returned with comments</li>
              <li><strong>Paid:</strong> Reimbursement processed</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Manager Approval</h3>
            <p>Managers can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Review all submitted expenses</li>
              <li>Verify receipts and amounts</li>
              <li>Approve or reject individual items</li>
              <li>Request additional information</li>
              <li>Add approval notes</li>
              <li>Batch approve multiple reports</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Reimbursement</h3>
            <p>Process approved expenses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic addition to next payroll</li>
              <li>Direct deposit to employee account</li>
              <li>Check printing</li>
              <li>Manual payment recording</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Fast Track:</strong> Approved expenses can be reimbursed in the next payroll cycle.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'profit-loss-statement': {
    title: 'Profit & Loss Statement',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Profit & Loss Statement</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Track revenue, expenses, and profitability over time.</p>

            <h3 className="text-2xl font-bold mt-8">P&L Components</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Revenue:</strong> Total income from sales and services</li>
              <li><strong>Cost of Goods Sold:</strong> Direct costs of producing goods/services</li>
              <li><strong>Gross Profit:</strong> Revenue minus COGS</li>
              <li><strong>Operating Expenses:</strong> Overhead costs (rent, salaries, utilities)</li>
              <li><strong>Operating Income:</strong> Gross profit minus operating expenses</li>
              <li><strong>Other Income/Expenses:</strong> Interest, gains/losses</li>
              <li><strong>Net Income:</strong> Bottom line profit or loss</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Sample P&L Statement</h3>
            <div className="bg-white dark:bg-gray-900 border-2 rounded-lg p-8 my-6">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold">ABC Company</h4>
                <p className="text-lg">Profit & Loss Statement</p>
                <p className="text-sm text-foreground/60">For the Year Ended December 31, 2024</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-bold text-lg text-emerald-600 mb-3">Revenue</p>
                  <div className="space-y-2 text-sm pl-4">
                    <div className="flex justify-between">
                      <span>Product Sales</span>
                      <span className="font-mono">$450,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Revenue</span>
                      <span className="font-mono">$280,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscription Revenue</span>
                      <span className="font-mono">$120,000</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total Revenue</span>
                      <span className="font-mono">$850,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg text-red-600 mb-3">Cost of Goods Sold</p>
                  <div className="space-y-2 text-sm pl-4">
                    <div className="flex justify-between">
                      <span>Materials & Supplies</span>
                      <span className="font-mono">$180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direct Labor</span>
                      <span className="font-mono">$95,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manufacturing Overhead</span>
                      <span className="font-mono">$45,000</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total COGS</span>
                      <span className="font-mono">$320,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Gross Profit</span>
                    <div className="text-right">
                      <p className="font-bold text-xl font-mono text-emerald-600">$530,000</p>
                      <p className="text-sm text-emerald-600">62.4% margin</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg text-orange-600 mb-3">Operating Expenses</p>
                  <div className="space-y-2 text-sm pl-4">
                    <div className="flex justify-between">
                      <span>Salaries & Wages</span>
                      <span className="font-mono">$185,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent & Utilities</span>
                      <span className="font-mono">$48,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing & Advertising</span>
                      <span className="font-mono">$65,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span className="font-mono">$24,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Supplies</span>
                      <span className="font-mono">$12,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Fees</span>
                      <span className="font-mono">$18,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depreciation</span>
                      <span className="font-mono">$22,000</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total Operating Expenses</span>
                      <span className="font-mono">$374,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Operating Income</span>
                    <div className="text-right">
                      <p className="font-bold text-xl font-mono text-blue-600">$156,000</p>
                      <p className="text-sm text-blue-600">18.4% margin</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg text-purple-600 mb-3">Other Income & Expenses</p>
                  <div className="space-y-2 text-sm pl-4">
                    <div className="flex justify-between">
                      <span>Interest Income</span>
                      <span className="font-mono text-emerald-600">$3,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Expense</span>
                      <span className="font-mono text-red-600">($8,200)</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Net Other Income/(Expense)</span>
                      <span className="font-mono text-red-600">($4,700)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-2 border-emerald-500 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl">Net Income</span>
                    <div className="text-right">
                      <p className="font-bold text-3xl font-mono text-emerald-600">$151,300</p>
                      <p className="text-lg text-emerald-600">17.8% net margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Generating P&L Reports</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Reports → Profit & Loss</strong></li>
              <li>Select date range (month, quarter, year, custom)</li>
              <li>Choose comparison period (optional)</li>
              <li>Select cash or accrual basis</li>
              <li>Filter by department, location, or class</li>
              <li>Generate report</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Report Formats</h3>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Standard</h4>
                <p className="text-sm">Traditional format with totals and subtotals</p>
              </div>
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Comparative</h4>
                <p className="text-sm">Side-by-side period comparison</p>
              </div>
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Trend</h4>
                <p className="text-sm">Multiple periods showing trends over time</p>
              </div>
              <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-bold mb-2">Percentage</h4>
                <p className="text-sm">Each line as percentage of revenue</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Key Metrics</h3>
            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6 my-6">
              <div className="space-y-4">
                <div>
                  <p className="font-bold mb-2">Gross Margin</p>
                  <p className="text-sm mb-1 font-mono">(Gross Profit / Revenue) × 100</p>
                  <p className="text-sm text-emerald-600">Example: ($530,000 / $850,000) × 100 = 62.4%</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Operating Margin</p>
                  <p className="text-sm mb-1 font-mono">(Operating Income / Revenue) × 100</p>
                  <p className="text-sm text-blue-600">Example: ($156,000 / $850,000) × 100 = 18.4%</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Net Margin</p>
                  <p className="text-sm mb-1 font-mono">(Net Income / Revenue) × 100</p>
                  <p className="text-sm text-purple-600">Example: ($151,300 / $850,000) × 100 = 17.8%</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Insight:</strong> Review P&L monthly to identify trends and make informed business decisions.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'balance-sheet': {
    title: 'Balance Sheet',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Balance Sheet</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">View your company's financial position at a specific point in time.</p>

            <h3 className="text-2xl font-bold mt-8">Balance Sheet Equation</h3>
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6 text-center my-6">
              <p className="text-2xl font-bold">Assets = Liabilities + Equity</p>
            </div>

            <h3 className="text-2xl font-bold mt-8">Assets</h3>
            <p><strong>Current Assets (converted to cash within 1 year):</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Cash and cash equivalents</li>
              <li>Accounts receivable</li>
              <li>Inventory</li>
              <li>Prepaid expenses</li>
            </ul>
            <p><strong>Fixed Assets (long-term):</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Property and equipment</li>
              <li>Vehicles</li>
              <li>Less: Accumulated depreciation</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Liabilities</h3>
            <p><strong>Current Liabilities (due within 1 year):</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Accounts payable</li>
              <li>Credit cards</li>
              <li>Accrued expenses</li>
              <li>Current portion of loans</li>
            </ul>
            <p><strong>Long-term Liabilities:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Loans and mortgages</li>
              <li>Bonds payable</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Equity</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Owner's equity or capital</li>
              <li>Retained earnings</li>
              <li>Current year profit/loss</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Key Ratios</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Current Ratio:</strong> Current Assets / Current Liabilities</li>
              <li><strong>Debt-to-Equity:</strong> Total Liabilities / Total Equity</li>
              <li><strong>Working Capital:</strong> Current Assets - Current Liabilities</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> A healthy current ratio is typically between 1.5 and 3.0.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'cash-flow-report': {
    title: 'Cash Flow Report',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Cash Flow Report</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Track the movement of cash in and out of your business.</p>

            <h3 className="text-2xl font-bold mt-8">Cash Flow Categories</h3>
            
            <div className="space-y-4 mt-6">
              <div className="border-l-4 border-emerald-600 pl-6 py-4 bg-emerald-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Operating Activities</h4>
                <p className="mb-2">Cash from day-to-day business operations</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Cash received from customers</li>
                  <li>Cash paid to suppliers and employees</li>
                  <li>Interest and taxes paid</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Investing Activities</h4>
                <p className="mb-2">Cash from buying/selling long-term assets</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Purchase of equipment or property</li>
                  <li>Sale of assets</li>
                  <li>Investments in securities</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-600 pl-6 py-4 bg-purple-600/5 rounded-r-lg">
                <h4 className="text-xl font-bold mb-2">Financing Activities</h4>
                <p className="mb-2">Cash from investors and creditors</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Loans received or repaid</li>
                  <li>Owner investments or withdrawals</li>
                  <li>Dividend payments</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Generating Cash Flow Reports</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Reports → Cash Flow</strong></li>
              <li>Select date range</li>
              <li>Choose direct or indirect method</li>
              <li>Generate report</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Cash Flow Forecasting</h3>
            <p>Project future cash position:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Based on historical patterns</li>
              <li>Include scheduled payments</li>
              <li>Factor in seasonal variations</li>
              <li>Plan for upcoming expenses</li>
            </ul>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Warning:</strong> Negative cash flow from operations for multiple periods may indicate business problems.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'custom-reports': {
    title: 'Custom Reports',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Custom Reports</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Create tailored reports to meet your specific business needs.</p>

            <h3 className="text-2xl font-bold mt-8">Report Builder</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Reports → Custom Reports</strong></li>
              <li>Click "Create New Report"</li>
              <li>Select data source (transactions, invoices, expenses, etc.)</li>
              <li>Choose columns to include</li>
              <li>Add filters and conditions</li>
              <li>Set grouping and sorting</li>
              <li>Apply calculations (sum, average, count)</li>
              <li>Preview and save report</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Available Data Sources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>General ledger transactions</li>
              <li>Invoices and payments</li>
              <li>Expenses and bills</li>
              <li>Payroll data</li>
              <li>Customer and vendor information</li>
              <li>Inventory and products</li>
              <li>Time tracking</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Report Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Filters:</strong> Date ranges, amounts, categories, tags</li>
              <li><strong>Grouping:</strong> By customer, vendor, account, department</li>
              <li><strong>Calculations:</strong> Totals, subtotals, percentages</li>
              <li><strong>Formatting:</strong> Colors, fonts, conditional formatting</li>
              <li><strong>Charts:</strong> Bar, line, pie charts</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Sharing and Scheduling</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Export to PDF, Excel, CSV</li>
              <li>Email reports automatically</li>
              <li>Schedule daily, weekly, or monthly</li>
              <li>Share with team members</li>
              <li>Create dashboard widgets</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Pro Tip:</strong> Save frequently used custom reports as templates for quick access.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'tax-setup': {
    title: 'Tax Setup',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Tax Setup</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Configure tax settings for accurate calculations and compliance.</p>

            <h3 className="text-2xl font-bold mt-8">Federal Tax Setup</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Tax → Settings</strong></li>
              <li>Enter Employer Identification Number (EIN)</li>
              <li>Select business entity type</li>
              <li>Set fiscal year dates</li>
              <li>Choose accounting method (cash or accrual)</li>
              <li>Configure federal tax deposit schedule</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">State Tax Registration</h3>
            <p>Register for state taxes where you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Have physical presence (office, warehouse)</li>
              <li>Have employees working</li>
              <li>Meet economic nexus thresholds for sales tax</li>
              <li>Own property or equipment</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Tax Types to Configure</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Income Tax:</strong> Federal and state corporate/business tax</li>
              <li><strong>Payroll Tax:</strong> FICA, FUTA, SUTA, withholding</li>
              <li><strong>Sales Tax:</strong> State and local sales tax rates</li>
              <li><strong>Property Tax:</strong> Real estate and personal property</li>
              <li><strong>Excise Tax:</strong> Industry-specific taxes</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Tax Deposit Schedule</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Monthly:</strong> Tax liability under $50,000</li>
              <li><strong>Semi-weekly:</strong> Tax liability over $50,000</li>
              <li><strong>Next-day:</strong> Tax liability over $100,000 in any period</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Important:</strong> PayFlow automatically determines your deposit schedule based on your tax liability.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'sales-tax': {
    title: 'Sales Tax',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Sales Tax</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Manage sales tax collection, reporting, and filing.</p>

            <h3 className="text-2xl font-bold mt-8">Sales Tax Nexus</h3>
            <p>You have nexus (obligation to collect sales tax) when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Have physical presence in a state</li>
              <li>Exceed economic nexus thresholds ($100,000 sales or 200 transactions)</li>
              <li>Have employees or inventory in a state</li>
              <li>Attend trade shows or events</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Setting Up Sales Tax</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Tax → Sales Tax</strong></li>
              <li>Click "Add Tax Jurisdiction"</li>
              <li>Select state and locality</li>
              <li>Enter tax registration number</li>
              <li>Set tax rate (auto-populated)</li>
              <li>Configure filing frequency</li>
              <li>Enable automatic calculation</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Tax Rates</h3>
            <p>PayFlow maintains current rates for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>State sales tax</li>
              <li>County tax</li>
              <li>City tax</li>
              <li>Special district taxes</li>
              <li>Combined rates by ZIP code</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Exemptions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tax-exempt customers (nonprofits, resellers)</li>
              <li>Tax-exempt products (groceries, medicine)</li>
              <li>Upload exemption certificates</li>
              <li>Track certificate expiration dates</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Filing and Remittance</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic calculation of tax due</li>
              <li>Generate sales tax returns</li>
              <li>File electronically (AutoFile available)</li>
              <li>Remit payment to tax authorities</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>AutoFile:</strong> PayFlow can automatically file and remit sales tax in all 50 states.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'tax-forms-w-2-1099': {
    title: 'Tax Forms (W-2, 1099)',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Tax Forms (W-2, 1099)</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Generate and file year-end tax forms for employees and contractors.</p>

            <h3 className="text-2xl font-bold mt-8">Form W-2 (Employees)</h3>
            <p>Wage and Tax Statement for employees:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Who receives:</strong> All employees paid during the year</li>
              <li><strong>Information included:</strong> Wages, tips, federal/state withholding, Social Security, Medicare</li>
              <li><strong>Deadline:</strong> January 31</li>
              <li><strong>Filing:</strong> Copy A to SSA, Copy 1 to state, Copies B/C to employee</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Form 1099-NEC (Contractors)</h3>
            <p>Nonemployee Compensation for contractors:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Who receives:</strong> Contractors paid $600+ during the year</li>
              <li><strong>Information included:</strong> Total payments for services</li>
              <li><strong>Deadline:</strong> January 31</li>
              <li><strong>Filing:</strong> Copy A to IRS, Copy 1 to state, Copy B to contractor</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Form 1099-MISC</h3>
            <p>Miscellaneous Information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Rent payments ($600+)</li>
              <li>Royalties ($10+)</li>
              <li>Other income</li>
              <li>Medical and health care payments</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Generating Forms in PayFlow</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Tax → Year-End Forms</strong></li>
              <li>Select tax year</li>
              <li>Review employee/contractor list</li>
              <li>Verify addresses and SSN/EIN</li>
              <li>Generate forms</li>
              <li>Review for accuracy</li>
              <li>Print or e-file</li>
              <li>Distribute to recipients</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">E-Filing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>File directly with IRS and SSA</li>
              <li>Email copies to recipients</li>
              <li>Faster processing</li>
              <li>Confirmation of receipt</li>
              <li>Required for 10+ forms</li>
            </ul>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Penalty Warning:</strong> Late filing penalties start at $50 per form and increase over time.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'tax-filing': {
    title: 'Tax Filing',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Tax Filing</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">File federal and state tax returns directly from PayFlow.</p>

            <h3 className="text-2xl font-bold mt-8">Federal Tax Returns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Form 941:</strong> Quarterly payroll tax return</li>
              <li><strong>Form 940:</strong> Annual FUTA return</li>
              <li><strong>Form 1120/1120S:</strong> Corporate income tax</li>
              <li><strong>Form 1065:</strong> Partnership return</li>
              <li><strong>Schedule C:</strong> Sole proprietor (via Form 1040)</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">State Tax Returns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>State income tax returns</li>
              <li>State unemployment (SUTA) returns</li>
              <li>Sales tax returns</li>
              <li>Franchise tax returns</li>
              <li>Local tax returns</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Filing Process</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Tax → File Returns</strong></li>
              <li>Select return type and period</li>
              <li>Review pre-filled information</li>
              <li>Make any necessary adjustments</li>
              <li>Preview completed return</li>
              <li>E-file or download PDF</li>
              <li>Make payment (if balance due)</li>
              <li>Save confirmation</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Payment Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>EFTPS:</strong> Electronic Federal Tax Payment System</li>
              <li><strong>Direct Debit:</strong> Automatic bank withdrawal</li>
              <li><strong>Credit Card:</strong> Pay with card (fees apply)</li>
              <li><strong>Check:</strong> Mail payment with voucher</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Filing Calendar</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic reminders before due dates</li>
              <li>Track filing status</li>
              <li>View payment history</li>
              <li>Download filed returns</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>AutoFile:</strong> Enable automatic filing to never miss a deadline. PayFlow files and pays on your behalf.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'api-authentication': {
    title: 'API Authentication',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">API Authentication</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Secure your API access with authentication tokens.</p>

            <h3 className="text-2xl font-bold mt-8">API Keys</h3>
            <p>PayFlow uses API keys for authentication:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Public Key:</strong> Identifies your account</li>
              <li><strong>Secret Key:</strong> Authenticates requests (keep private)</li>
              <li><strong>Test Keys:</strong> For development and testing</li>
              <li><strong>Live Keys:</strong> For production use</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Generating API Keys</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Navigate to <strong>Settings → API</strong></li>
              <li>Click "Create API Key"</li>
              <li>Enter key name/description</li>
              <li>Select permissions (read, write, delete)</li>
              <li>Choose environment (test or live)</li>
              <li>Generate key</li>
              <li>Copy and securely store secret key</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Authentication Methods</h3>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4">
              <p className="text-sm font-mono mb-2">Bearer Token (Recommended):</p>
              <code className="text-emerald-400">Authorization: Bearer YOUR_SECRET_KEY</code>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4">
              <p className="text-sm font-mono mb-2">Basic Auth:</p>
              <code className="text-emerald-400">Authorization: Basic base64(api_key:secret)</code>
            </div>

            <h3 className="text-2xl font-bold mt-8">Security Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never commit API keys to version control</li>
              <li>Use environment variables for keys</li>
              <li>Rotate keys regularly (every 90 days)</li>
              <li>Use different keys for each environment</li>
              <li>Revoke compromised keys immediately</li>
              <li>Limit key permissions to minimum required</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Key Management</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>View all active keys</li>
              <li>Monitor key usage and activity</li>
              <li>Set expiration dates</li>
              <li>Revoke or regenerate keys</li>
              <li>Audit log of key usage</li>
            </ul>

            <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Security:</strong> Secret keys provide full access to your account. Treat them like passwords.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'webhooks': {
    title: 'Webhooks',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Webhooks</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Receive real-time notifications when events occur in your PayFlow account.</p>

            <h3 className="text-2xl font-bold mt-8">What are Webhooks?</h3>
            <p>Webhooks are HTTP callbacks that notify your application when specific events happen:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Invoice created, sent, or paid</li>
              <li>Payment received or failed</li>
              <li>Expense submitted or approved</li>
              <li>Payroll processed</li>
              <li>Customer created or updated</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Setting Up Webhooks</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Go to <strong>Settings → Webhooks</strong></li>
              <li>Click "Add Webhook Endpoint"</li>
              <li>Enter your endpoint URL</li>
              <li>Select events to subscribe to</li>
              <li>Choose API version</li>
              <li>Save webhook</li>
              <li>Test with sample event</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Webhook Payload</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
              <pre className="text-sm font-mono">
{`{
  "id": "evt_1234567890",
  "type": "invoice.paid",
  "created": 1234567890,
  "data": {
    "object": {
      "id": "inv_abc123",
      "amount": 1500.00,
      "customer": "cus_xyz789",
      "status": "paid"
    }
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Verifying Webhooks</h3>
            <p>Verify webhook signatures to ensure authenticity:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Extract signature from header: <code className="bg-gray-200 px-2 py-1 rounded">X-PayFlow-Signature</code></li>
              <li>Compute HMAC with webhook secret</li>
              <li>Compare computed signature with received signature</li>
              <li>Process event only if signatures match</li>
            </ol>

            <h3 className="text-2xl font-bold mt-8">Retry Logic</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>PayFlow retries failed webhooks automatically</li>
              <li>Exponential backoff: 1min, 5min, 30min, 2hr, 6hr</li>
              <li>Maximum 5 retry attempts</li>
              <li>View delivery status in dashboard</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Return 200 status code quickly</li>
              <li>Process events asynchronously</li>
              <li>Handle duplicate events (idempotency)</li>
              <li>Log all webhook events</li>
              <li>Use HTTPS endpoints only</li>
            </ul>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Testing:</strong> Use webhook.site or ngrok to test webhooks during development.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'rate-limits': {
    title: 'Rate Limits',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Rate Limits</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Understand API rate limits to ensure smooth integration.</p>

            <h3 className="text-2xl font-bold mt-8">Rate Limit Tiers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Starter Plan:</strong> 1,000 requests per hour</li>
              <li><strong>Professional Plan:</strong> 5,000 requests per hour</li>
              <li><strong>Enterprise Plan:</strong> 20,000 requests per hour</li>
              <li><strong>Custom:</strong> Contact sales for higher limits</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Rate Limit Headers</h3>
            <p>Every API response includes rate limit information:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4">
              <pre className="text-sm font-mono">
{`X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4850
X-RateLimit-Reset: 1234567890`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Handling Rate Limits</h3>
            <p>When you exceed the rate limit, you'll receive:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4">
              <pre className="text-sm font-mono">
{`HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "error": {
    "type": "rate_limit_error",
    "message": "Too many requests"
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Implement Exponential Backoff:</strong> Wait longer between retries</li>
              <li><strong>Cache Responses:</strong> Reduce unnecessary API calls</li>
              <li><strong>Batch Requests:</strong> Use bulk endpoints when available</li>
              <li><strong>Monitor Usage:</strong> Track rate limit headers</li>
              <li><strong>Spread Requests:</strong> Don't burst all requests at once</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Retry Strategy Example</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
              <pre className="text-sm font-mono">
{`async function makeRequest(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      await sleep(retryAfter * 1000);
      continue;
    }
    
    return response;
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Monitoring Usage</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>View API usage dashboard</li>
              <li>Set up alerts for high usage</li>
              <li>Track requests by endpoint</li>
              <li>Identify optimization opportunities</li>
            </ul>

            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Pro Tip:</strong> Use webhooks instead of polling to reduce API calls and stay within limits.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
  'error-handling': {
    title: 'Error Handling',
    content: (
      <>
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Error Handling</h2>
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg">Handle API errors gracefully in your integration.</p>

            <h3 className="text-2xl font-bold mt-8">HTTP Status Codes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>200 OK:</strong> Request succeeded</li>
              <li><strong>201 Created:</strong> Resource created successfully</li>
              <li><strong>400 Bad Request:</strong> Invalid request parameters</li>
              <li><strong>401 Unauthorized:</strong> Invalid or missing API key</li>
              <li><strong>403 Forbidden:</strong> Insufficient permissions</li>
              <li><strong>404 Not Found:</strong> Resource doesn't exist</li>
              <li><strong>429 Too Many Requests:</strong> Rate limit exceeded</li>
              <li><strong>500 Internal Server Error:</strong> Server error</li>
              <li><strong>503 Service Unavailable:</strong> Temporary outage</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Error Response Format</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
              <pre className="text-sm font-mono">
{`{
  "error": {
    "type": "validation_error",
    "message": "Invalid email address",
    "code": "invalid_email",
    "param": "customer.email",
    "doc_url": "https://docs.payflow.com/errors/invalid_email"
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Error Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>api_error:</strong> Generic API error</li>
              <li><strong>authentication_error:</strong> Invalid credentials</li>
              <li><strong>validation_error:</strong> Invalid parameters</li>
              <li><strong>rate_limit_error:</strong> Too many requests</li>
              <li><strong>resource_not_found:</strong> Resource doesn't exist</li>
              <li><strong>permission_error:</strong> Insufficient permissions</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Handling Errors</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
              <pre className="text-sm font-mono">
{`try {
  const response = await payflow.invoices.create({
    customer: 'cus_123',
    amount: 1500.00
  });
} catch (error) {
  if (error.type === 'validation_error') {
    console.log('Invalid data:', error.message);
  } else if (error.type === 'rate_limit_error') {
    // Wait and retry
    await sleep(error.retryAfter * 1000);
  } else {
    // Log and alert
    console.error('API Error:', error);
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mt-8">Best Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Always check HTTP status codes</li>
              <li>Parse error responses for details</li>
              <li>Implement retry logic for 5xx errors</li>
              <li>Log errors for debugging</li>
              <li>Show user-friendly error messages</li>
              <li>Monitor error rates</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8">Idempotency</h3>
            <p>Use idempotency keys to safely retry requests:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4">
              <pre className="text-sm font-mono">
{`POST /api/v1/invoices
Idempotency-Key: unique-key-123

// Same key = same result, no duplicate invoice`}
              </pre>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm"><strong>Tip:</strong> Use UUIDs as idempotency keys to ensure uniqueness across requests.</p>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  },
}

export default function DocumentationArticle() {
  const params = useParams()
  const slug = params?.slug as string
  const article = articles[slug]

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/documentation" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
            <ArrowLeft size={20} />
            Back to Documentation
          </Link>
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-foreground/70">The documentation article you're looking for doesn't exist.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/documentation" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Documentation
        </Link>
        {article.content}
      </div>
    </div>
  )
}
