'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowRight, Check, DollarSign, Calculator, TrendingUp, Shield, Clock, Users, FileText, Zap, BarChart3, CreditCard, Lock, Sparkles, Brain } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useScrollAnimation, useCountUp } from '@/hooks/use-scroll-animation'
import DashboardPreview from './_components/dashboard-preview'
import TrustBadges from './_components/trust-badges'
import LiveMetrics from './_components/live-metrics'
import IntegrationLogos from './_components/integration-logos'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  const companies = useCountUp(2000, 2000)
  const employees = useCountUp(50000, 2000)
  const processed = useCountUp(500, 2000)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          companies.start()
          employees.start()
          processed.start()
        }
      },
      { threshold: 0.5 }
    )
    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    return () => observer.disconnect()
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
      text: 'SyncBooks reduced our payroll processing time by 80%. The automation is incredible.',
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
      question: 'How does SyncBooks handle tax compliance?',
      answer: 'SyncBooks automatically calculates federal, state, and local taxes, generates tax forms, and keeps you compliant with the latest regulations. We support W-2, 1099, and all standard tax filings.',
    },
    {
      question: 'Can I migrate my existing payroll data?',
      answer: 'Yes! Our migration team will help you seamlessly transfer all employee data, payroll history, and accounting records from your current system with zero downtime.',
    },
    {
      question: 'What integrations does SyncBooks support?',
      answer: 'SyncBooks integrates with major banks, accounting software (QuickBooks, Xero), time tracking tools, and HR systems. We also provide a robust API for custom integrations.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level 256-bit encryption, SOC 2 Type II certified data centers, and comply with all financial data protection regulations including PCI DSS.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-float opacity-40 transition-transform duration-1000"
          style={{
            top: `${mousePosition.y / 20}px`,
            left: `${mousePosition.x / 20}px`,
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float opacity-40 transition-transform duration-1000" 
          style={{
            bottom: `${mousePosition.y / 30}px`,
            right: `${mousePosition.x / 30}px`,
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <div className="flex items-center">
              <span className="font-bold text-xl text-emerald-600">Sync</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Books</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="hover:text-emerald-600 transition-colors">Features</Link>
            <Link href="/solutions" className="hover:text-emerald-600 transition-colors">Solutions</Link>
            <Link href="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link>
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
            <Link href="/features" className="block hover:text-emerald-600">Features</Link>
            <Link href="/solutions" className="block hover:text-emerald-600">Solutions</Link>
            <Link href="/pricing" className="block hover:text-emerald-600">Pricing</Link>
            <Link href="/faq" className="block hover:text-emerald-600">FAQ</Link>
            <Link href="/sign-up">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 backdrop-blur border border-purple-500/20 rounded-full">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-sm font-medium">AI-Powered Automation</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Financial Management
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradientShift">Made Simple with AI</span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-lg">
                Complete accounting, payroll, inventory, and business management with advanced AI features. 
                Get instant insights, smart categorization, and predictive analytics.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 py-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">AI Chat Assistant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Invoice OCR</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Smart Analytics</span>
              </div>
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

            <div className="flex items-center gap-8 pt-8 border-t border-border/40" ref={heroRef}>
              <div>
                <div className="text-2xl font-bold">GHS {companies.count.toLocaleString()}+</div>
                <div className="text-sm text-foreground/60">Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{(employees.count / 1000).toFixed(0)}K+</div>
                <div className="text-sm text-foreground/60">Employees Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold">GHS {processed.count}M+</div>
                <div className="text-sm text-foreground/60">Processed</div>
              </div>
            </div>
          </div>

          <div className="animate-slideInRight relative h-96 md:h-full">
            <DashboardPreview />
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
              <Card key={index} className="group p-8 bg-card/50 backdrop-blur border border-border/40 hover:border-emerald-500/40 transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
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
            <Card key={index} className="group p-8 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur border border-border/40 hover:border-emerald-500/40 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/20 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
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

      <IntegrationLogos />

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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Simplify Your Finances?</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">Join 2,000+ businesses already using SyncBooks to automate their finances</p>
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
        
        <TrustBadges />
      </section>

      <LiveMetrics />

      <footer className="relative border-t border-border/40 bg-gradient-to-b from-card/30 to-card/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
                <div className="flex items-center">
                  <span className="font-bold text-2xl text-emerald-600">Sync</span>
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">Books</span>
                </div>
              </div>
              <p className="text-foreground/70 mb-6 max-w-sm">Modern financial management software trusted by 2,000+ businesses worldwide. Automate your finances and focus on growth.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-background/50 border border-border/40 hover:border-emerald-500/40 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/50 border border-border/40 hover:border-emerald-500/40 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/50 border border-border/40 hover:border-emerald-500/40 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-foreground/60">
                <li><Link href="/features" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Features</Link></li>
                <li><Link href="/solutions" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Solutions</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Pricing</Link></li>
                <li><Link href="/testimonials" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Testimonials</Link></li>
                <li><Link href="/integrations" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-foreground/60">
                <li><Link href="/faq" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> FAQ</Link></li>
                <li><Link href="/documentation" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Documentation</Link></li>
                <li><Link href="/api-reference" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> API Reference</Link></li>
                <li><Link href="/support" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Support Center</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-foreground/60">
                <li><Link href="/about" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> About Us</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Careers</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600 transition-colors flex items-center gap-2"><span className="text-emerald-600">→</span> Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-foreground/60">
                <p>&copy; ${new Date().getFullYear()} SyncBooks. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    SOC 2 Certified
                  </span>
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    256-bit Encryption
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground/60">Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span className="text-foreground/60">for businesses</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
