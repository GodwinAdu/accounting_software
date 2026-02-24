import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function TestimonialsPage() {
  const testimonials = [
    { name: 'David Martinez', role: 'CFO', company: 'TechStart Inc', text: 'PayFlow reduced our payroll processing time by 80%. The automation is incredible.', rating: 5 },
    { name: 'Lisa Thompson', role: 'HR Director', company: 'Growth Solutions', text: 'Best accounting software we\'ve used. Tax compliance is now completely automated.', rating: 5 },
    { name: 'James Wilson', role: 'Business Owner', company: 'Wilson & Co', text: 'From invoicing to payroll, everything is seamless. Saved us thousands in accounting fees.', rating: 5 },
    { name: 'Sarah Chen', role: 'Finance Manager', company: 'Digital Ventures', text: 'The reporting features are outstanding. We get real-time insights into our finances.', rating: 5 },
    { name: 'Michael Brown', role: 'CEO', company: 'StartupHub', text: 'PayFlow scaled with us from 5 to 50 employees. Couldn\'t be happier with the service.', rating: 5 },
    { name: 'Emily Davis', role: 'Controller', company: 'Retail Plus', text: 'Integration with our existing tools was seamless. Support team is incredibly responsive.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Trusted by Businesses</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            See what our customers are saying about PayFlow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="p-8 hover:border-emerald-500/40 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <div key={j} className="w-5 h-5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full"></div>
                ))}
              </div>
              <p className="text-foreground/70 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
