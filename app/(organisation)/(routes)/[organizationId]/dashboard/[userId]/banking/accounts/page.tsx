import PageTemplate from '@/components/commons/PageTemplate'
import { Wallet } from 'lucide-react'

export default function BankAccountsPage() {
  return <PageTemplate title="Bank Accounts" description="Manage your bank accounts and connections" icon={<Wallet className="h-8 w-8" />} />
}
