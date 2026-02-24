import Link from 'next/link'
import { ArrowLeft, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-6">Support Center</h1>
        <p className="text-xl text-foreground/70 mb-12">
          We're here to help. Choose how you'd like to get support.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center hover:border-emerald-500/40 transition-all">
            <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-foreground/60 mb-4">Chat with our support team</p>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">Start Chat</Button>
          </Card>
          <Card className="p-8 text-center hover:border-emerald-500/40 transition-all">
            <Mail className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-foreground/60 mb-4">support@payflow.com</p>
            <Button variant="outline">Send Email</Button>
          </Card>
          <Card className="p-8 text-center hover:border-emerald-500/40 transition-all">
            <Phone className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone Support</h3>
            <p className="text-foreground/60 mb-4">1-800-PAYFLOW</p>
            <Button variant="outline">Call Now</Button>
          </Card>
        </div>

        <Card className="p-8">
          <HelpCircle className="w-12 h-12 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-foreground/70">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <Link href="/#faq">
            <Button className="mt-4" variant="outline">View FAQ</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
