import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FaqPage() {
  const faqs = [
    { question: 'How does PayFlow handle tax compliance?', answer: 'PayFlow automatically calculates federal, state, and local taxes, generates tax forms, and keeps you compliant with the latest regulations. We support W-2, 1099, and all standard tax filings.' },
    { question: 'Can I migrate my existing payroll data?', answer: 'Yes! Our migration team will help you seamlessly transfer all employee data, payroll history, and accounting records from your current system with zero downtime.' },
    { question: 'What integrations does PayFlow support?', answer: 'PayFlow integrates with major banks, accounting software (QuickBooks, Xero), time tracking tools, and HR systems. We also provide a robust API for custom integrations.' },
    { question: 'Is my financial data secure?', answer: 'Absolutely. We use bank-level 256-bit encryption, SOC 2 Type II certified data centers, and comply with all financial data protection regulations including PCI DSS.' },
    { question: 'How much does PayFlow cost?', answer: 'We offer three plans: Starter ($49/month), Professional ($149/month), and Enterprise (custom pricing). Each plan includes different features and employee limits.' },
    { question: 'Do you offer a free trial?', answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.' },
    { question: 'Can I cancel my subscription anytime?', answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.' },
    { question: 'What kind of support do you provide?', answer: 'We offer email support for all plans, priority support for Professional plans, and dedicated account managers for Enterprise customers. Our support team is available 24/7.' },
    { question: 'How long does implementation take?', answer: 'Most customers are up and running within 1-2 weeks. Our implementation team will guide you through the entire process.' },
    { question: 'Do you handle multi-state payroll?', answer: 'Yes, PayFlow supports multi-state payroll with automatic tax calculations for all 50 states.' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-12 h-12 text-emerald-600" />
          <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
        </div>
        
        <p className="text-xl text-foreground/70 mb-12">
          Find answers to common questions about PayFlow
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border border-border/40 px-6 rounded-lg bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <AccordionTrigger className="font-semibold text-lg hover:text-emerald-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-foreground/70 mb-6">
            Our support team is here to help. Contact us anytime.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
