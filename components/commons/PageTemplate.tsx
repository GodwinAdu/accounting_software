import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PageTemplateProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function PageTemplate({ title, description, icon }: PageTemplateProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {icon}
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Button>Add New</Button>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          <p>This page is under construction.</p>
          <p className="text-sm mt-2">Content will be added soon.</p>
        </div>
      </Card>
    </div>
  )
}
