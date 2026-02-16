$pages = @(
  @{path="banking\feeds"; title="Bank Feeds"; desc="Automatic bank feed connections"; icon="Zap"},
  @{path="sales\invoices"; title="Invoices"; desc="Create and manage invoices"; icon="FileText"},
  @{path="sales\recurring-invoices"; title="Recurring Invoices"; desc="Manage recurring invoices"; icon="Repeat"},
  @{path="sales\customers"; title="Customers"; desc="Manage customer information"; icon="Users"},
  @{path="sales\estimates"; title="Estimates"; desc="Create and send estimates"; icon="Calculator"},
  @{path="sales\payments"; title="Payments Received"; desc="Track customer payments"; icon="DollarSign"},
  @{path="sales\receipts"; title="Sales Receipts"; desc="Manage sales receipts"; icon="Receipt"},
  @{path="expenses\all"; title="Expenses"; desc="Track all expenses"; icon="Receipt"},
  @{path="expenses\recurring"; title="Recurring Expenses"; desc="Manage recurring expenses"; icon="Repeat"},
  @{path="expenses\bills"; title="Bills"; desc="Manage vendor bills"; icon="FileText"},
  @{path="expenses\vendors"; title="Vendors"; desc="Manage vendor information"; icon="UsersRound"},
  @{path="expenses\purchase-orders"; title="Purchase Orders"; desc="Create purchase orders"; icon="ShoppingBag"},
  @{path="expenses\categories"; title="Expense Categories"; desc="Manage expense categories"; icon="CheckSquare"},
  @{path="payroll\employees"; title="Employees"; desc="Manage employee information"; icon="Users"},
  @{path="payroll\run"; title="Run Payroll"; desc="Process payroll"; icon="DollarSign"},
  @{path="payroll\history"; title="Payroll History"; desc="View payroll history"; icon="History"},
  @{path="payroll\time-tracking"; title="Time Tracking"; desc="Track employee time"; icon="Clock"},
  @{path="payroll\leave"; title="Leave Management"; desc="Manage employee leave"; icon="Calendar"},
  @{path="payroll\deductions"; title="Deductions"; desc="Manage payroll deductions"; icon="Calculator"},
  @{path="accounting\chart-of-accounts"; title="Chart of Accounts"; desc="Manage account structure"; icon="BookOpen"},
  @{path="accounting\journal-entries"; title="Journal Entries"; desc="Create journal entries"; icon="FileText"},
  @{path="accounting\general-ledger"; title="General Ledger"; desc="View general ledger"; icon="BookMarked"},
  @{path="tax\settings"; title="Tax Settings"; desc="Configure tax settings"; icon="Settings"},
  @{path="tax\sales-tax"; title="Sales Tax"; desc="Manage sales tax"; icon="DollarSign"},
  @{path="tax\reports"; title="Tax Reports"; desc="Generate tax reports"; icon="FileBarChart"},
  @{path="tax\1099"; title="1099 Forms"; desc="Manage 1099 forms"; icon="FileText"},
  @{path="tax\w2"; title="W-2 Forms"; desc="Manage W-2 forms"; icon="FileText"},
  @{path="reports\profit-loss"; title="Profit & Loss"; desc="P&L statement"; icon="TrendingUp"},
  @{path="reports\balance-sheet"; title="Balance Sheet"; desc="Balance sheet report"; icon="BarChart3"},
  @{path="reports\cash-flow"; title="Cash Flow"; desc="Cash flow statement"; icon="DollarSign"},
  @{path="reports\ar-aging"; title="AR Aging"; desc="Accounts receivable aging"; icon="Clock"},
  @{path="reports\ap-aging"; title="AP Aging"; desc="Accounts payable aging"; icon="Clock"},
  @{path="reports\trial-balance"; title="Trial Balance"; desc="Trial balance report"; icon="Calculator"},
  @{path="reports\general-ledger"; title="General Ledger Report"; desc="GL report"; icon="BookMarked"},
  @{path="reports\tax-summary"; title="Tax Summary"; desc="Tax summary report"; icon="FileText"},
  @{path="settings\company"; title="Company Profile"; desc="Manage company information"; icon="Building2"},
  @{path="settings\users"; title="Users & Roles"; desc="Manage users and permissions"; icon="Users"},
  @{path="settings\payment-methods"; title="Payment Methods"; desc="Configure payment methods"; icon="CreditCard"},
  @{path="settings\email-templates"; title="Email Templates"; desc="Customize email templates"; icon="FileText"},
  @{path="settings\integrations"; title="Integrations"; desc="Connect third-party apps"; icon="Zap"},
  @{path="settings\audit-logs"; title="Audit Logs"; desc="View system audit logs"; icon="Shield"}
)

$basePath = "app\(organisation)\(routes)\[organizationId]\dashboard\[userId]"

foreach ($page in $pages) {
  $fullPath = "$basePath\$($page.path)\page.tsx"
  $content = @"
import PageTemplate from '@/components/commons/PageTemplate'
import { $($page.icon) } from 'lucide-react'

export default function Page() {
  return <PageTemplate title="$($page.title)" description="$($page.desc)" icon={<$($page.icon) className="h-8 w-8" />} />
}
"@
  Set-Content -Path $fullPath -Value $content
  Write-Host "Created: $fullPath"
}

Write-Host "`nAll pages created successfully!"
