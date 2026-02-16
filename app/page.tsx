'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Check, DollarSign, Calculator, TrendingUp, Shield, Clock, Users, FileText, Zap, BarChart3, CreditCard } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: DollarSign,
      title: 'Automated Payroll',
      description: 'Process payroll in minutes with automated calculations, tax deductions, and direct deposits',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Calculator,
      title: 'Smart Accounting',
      description: 'Real-time bookkeeping with automated reconciliation and financial reporting',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Financial Analytics',
      description: 'Powerful insights with cash flow forecasting, P&L statements, and custom reports',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Tax Compliance',
      description: 'Stay compliant with automatic tax calculations, filings, and year-end reporting',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Integrated time tracking with automatic wage calculations and overtime management',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: FileText,
      title: 'Expense Management',
      description: 'Track expenses, manage reimbursements, and maintain complete audit trails',
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  const modules = [
    { title: 'Payroll Management', icon: '💰', description: 'Automated wage processing', gradient: 'from-emerald-600 to-teal-600' },
    { title: 'General Ledger', icon: '📊', description: 'Complete accounting system', gradient: 'from-blue-600 to-cyan-600' },
    { title: 'Invoicing & Billing', icon: '🧾', description: 'Professional invoices', gradient: 'from-purple-600 to-pink-600' },
    { title: 'Tax Management', icon: '📋', description: 'Automated tax compliance', gradient: 'from-orange-600 to-red-600' },
    { title: 'Employee Portal', icon: '👤', description: 'Self-service for employees', gradient: 'from-cyan-600 to-blue-600' },
    { title: 'Financial Reports', icon: '📈', description: 'Real-time insights', gradient: 'from-indigo-600 to-purple-600' },
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49',
      description: 'For small businesses',
      features: ['Up to 10 employees', 'Basic payroll processing', 'Expense tracking', 'Email support', 'Monthly reports'],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$149',
      description: 'For growing companies',
      features: ['Up to 100 employees', 'Advanced payroll & accounting', 'Tax compliance', 'Priority support', 'Custom reports', 'API access'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Unlimited employees', 'Multi-entity support', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option'],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: 'David Martinez',
      role: 'CFO',
      company: 'TechStart Inc',
      text: 'PayFlow reduced our payroll processing time by 80%. The automation is incredible.',
      rating: 5,
    },
    {
      name: 'Lisa Thompson',
      role: 'HR Director',
      company: 'Growth Solutions',
      text: 'Best accounting software we\'ve used. Tax compliance is now completely automated.',
      rating: 5,
    },
    {
      name: 'James Wilson',
      role: 'Business Owner',
      company: 'Wilson & Co',
      text: 'From invoicing to payroll, everything is seamless. Saved us thousands in accounting fees.',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'How does PayFlow handle tax compliance?',
      answer: 'PayFlow automatically calculates federal, state, and local taxes, generates tax forms, and keeps you compliant with the latest regulations. We support W-2, 1099, and all standard tax filings.',
    },
    {
      question: 'Can I migrate my existing payroll data?',
      answer: 'Yes! Our migration team will help you seamlessly transfer all employee data, payroll history, and accounting records from your current system with zero downtime.',
    },
    {
      question: 'What integrations does PayFlow support?',
      answer: 'PayFlow integrates with major banks, accounting software (QuickBooks, Xero), time tracking tools, and HR systems. We also provide a robust API for custom integrations.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level 256-bit encryption, SOC 2 Type II certified data centers, and comply with all financial data protection regulations including PCI DSS.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">PayFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#modules" className="hover:text-emerald-600 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex gap-4">
            <Link href="/sign-in" className={cn(buttonVariants({variant:"ghost"}))}>Log In</Link>
            <Link href="/sign-up" className={cn(buttonVariants({variant:"default"}), "bg-gradient-to-r from-emerald-600 to-teal-600")}>Get Started</Link>
          </div>

          <button className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden animate-fadeInUp bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-4 space-y-4">
            <a href="#features" className="block hover:text-emerald-600">Features</a>
            <a href="#modules" className="block hover:text-emerald-600">Solutions</a>
            <a href="#pricing" className="block hover:text-emerald-600">Pricing</a>
            <a href="#faq" className="block hover:text-emerald-600">FAQ</a>
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur border border-emerald-500/20 rounded-full">
              <Zap size={16} className="text-emerald-600" />
              <span className="text-sm font-medium">Automated Payroll & Accounting</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Payroll & Accounting
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradientShift">Made Simple</span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-lg">
                Automate payroll, manage finances, and stay tax compliant. All-in-one accounting software built for modern businesses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg h-14 px-8">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 hover:bg-secondary bg-transparent">
                Schedule Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-bold">2,000+</div>
                <div className="text-sm text-foreground/60">Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-foreground/60">Employees Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$500M+</div>
                <div className="text-sm text-foreground/60">Processed</div>
              </div>
            </div>
          </div>

          <div className="animate-slideInRight relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full"></div>
                    <div>
                      <div className="font-semibold">Monthly Payroll</div>
                      <div className="text-sm text-foreground/60">Processing...</div>
                    </div>
                  </div>
                  <Check className="text-emerald-600" size={24} />
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-emerald-500/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground/60">Total Wages</span>
                    <span className="font-bold">$125,450</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground/60">Tax Deductions</span>
                    <span className="font-bold">$28,320</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/40">
                    <span className="font-semibold">Net Pay</span>
                    <span className="font-bold text-emerald-600">$97,130</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Invoices', 'Expenses', 'Reports'].map((item, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg border border-emerald-500/20 text-center">
                      <div className="text-xs text-foreground/60">{item}</div>
                      <div className="font-bold mt-1">{Math.floor(Math.random() * 50) + 10}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Comprehensive payroll and accounting features in one platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group p-8 bg-card/50 backdrop-blur border border-border/40 hover:border-emerald-500/40 transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Complete Financial Suite</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">All the tools you need to manage your business finances</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="group p-8 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur border border-border/40 hover:border-emerald-500/40 transition-all duration-500 cursor-pointer animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`w-20 h-20 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-6 text-5xl group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {module.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
              <p className="text-foreground/60 text-sm">{module.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Choose the perfect plan for your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`relative p-8 animate-fadeInUp transition-all duration-500 ${tier.popular ? 'md:scale-105 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/40 shadow-2xl shadow-emerald-500/20' : 'bg-card/50 backdrop-blur border border-border/40'}`} style={{ animationDelay: `${index * 100}ms` }}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-foreground/60 mb-6">{tier.description}</p>

              <div className="mb-8">
                <span className="text-5xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-foreground/60">/month</span>}
              </div>

              <Button className={`w-full mb-8 h-12 ${tier.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}`} variant={tier.popular ? 'default' : 'outline'} size="lg">
                Get Started
              </Button>

              <div className="space-y-4">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Businesses</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">See what our customers are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-card/50 backdrop-blur border border-border/40 hover:border-emerald-500/40 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full"></div>
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-foreground/60">Have questions? We have answers</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border border-border/40 px-6 rounded-lg bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <AccordionTrigger className="font-semibold text-lg hover:text-emerald-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
          <div className="relative p-16 md:p-20 text-center border border-emerald-500/20 backdrop-blur">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Simplify Your Payroll?</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">Join 2,000+ businesses already using PayFlow to automate their finances</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg h-14 px-8">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                <span className="font-bold text-lg">PayFlow</span>
              </div>
              <p className="text-foreground/60">Modern payroll and accounting software for businesses</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Solutions</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-600 transition-colors">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Documentation</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">API</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">About</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-600 transition-colors">Customers</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-foreground/60 text-sm">
            <p>&copy; 2024 PayFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
