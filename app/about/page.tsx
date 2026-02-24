import Link from 'next/link'
import { ArrowLeft, Users, Target, Award, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About PayFlow</h1>
          <p className="text-xl text-foreground/70 mb-12">
            We're on a mission to simplify payroll and accounting for businesses worldwide.
          </p>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-foreground/80 leading-relaxed mb-6">
              Founded in 2020, PayFlow has grown to serve over 2,000 businesses, processing $500M+ in payroll annually. 
              We believe that managing finances shouldn't be complicated, time-consuming, or expensive.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Our platform combines powerful automation with intuitive design, making enterprise-grade accounting 
              accessible to businesses of all sizes. From startups to established enterprises, we're helping companies 
              focus on growth instead of paperwork.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-xl bg-card border border-border">
              <Target className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-foreground/70">
                To empower businesses with automated financial tools that save time, reduce errors, and provide real-time insights.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border">
              <Award className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-foreground/70">
                To become the world's most trusted payroll and accounting platform, making financial management effortless for everyone.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-foreground/70 mb-6">
              We're always looking for talented people to help us build the future of accounting.
            </p>
            <Link href="/careers">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
