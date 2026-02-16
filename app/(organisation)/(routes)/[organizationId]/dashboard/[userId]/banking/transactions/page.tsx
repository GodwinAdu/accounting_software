import PageTemplate from '@/components/commons/PageTemplate'
import { Receipt } from 'lucide-react'

export default function TransactionsPage() {
  return <PageTemplate title="Transactions" description="View and manage all transactions" icon={<Receipt className="h-8 w-8" />} />
}
