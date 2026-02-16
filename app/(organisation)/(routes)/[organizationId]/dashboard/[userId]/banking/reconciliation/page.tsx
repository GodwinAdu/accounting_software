import PageTemplate from '@/components/commons/PageTemplate'
import { CheckCircle } from 'lucide-react'
export default function Page() {
  return <PageTemplate title="Reconciliation" description="Reconcile bank accounts" icon={<CheckCircle className="h-8 w-8" />} />
}
