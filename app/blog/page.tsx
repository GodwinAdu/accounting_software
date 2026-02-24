import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function BlogPage() {
  const posts = [
    { title: '10 Payroll Best Practices for 2024', date: 'Dec 15, 2024', author: 'Sarah Johnson', excerpt: 'Learn the top strategies for efficient payroll management...' },
    { title: 'Understanding Tax Compliance', date: 'Dec 10, 2024', author: 'Mike Chen', excerpt: 'A comprehensive guide to staying compliant with tax regulations...' },
    { title: 'Automating Your Accounting Workflow', date: 'Dec 5, 2024', author: 'Emily Davis', excerpt: 'Discover how automation can save you hours every week...' },
    { title: 'Year-End Financial Checklist', date: 'Nov 28, 2024', author: 'David Martinez', excerpt: 'Everything you need to prepare for year-end closing...' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-6">Blog</h1>
        <p className="text-xl text-foreground/70 mb-12">
          Insights, tips, and best practices for payroll and accounting
        </p>

        <div className="grid gap-6">
          {posts.map((post, i) => (
            <Card key={i} className="p-8 hover:border-emerald-500/40 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
              <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {post.author}
                </span>
              </div>
              <p className="text-foreground/70">{post.excerpt}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
