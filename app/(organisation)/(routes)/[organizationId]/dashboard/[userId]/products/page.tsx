import PageTemplate from '@/components/commons/PageTemplate'
import { Package } from 'lucide-react'

export default function ProductsPage() {
  return <PageTemplate title="Products & Services" description="Manage your product and service catalog" icon={<Package className="h-8 w-8" />} />
}
