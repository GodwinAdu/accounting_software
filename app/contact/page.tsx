import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-foreground/70 mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-sm text-foreground/60">support@payflow.com</p>
            </Card>
            <Card className="p-6 text-center">
              <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-sm text-foreground/60">1-800-PAYFLOW</p>
            </Card>
            <Card className="p-6 text-center">
              <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Office</h3>
              <p className="text-sm text-foreground/60">San Francisco, CA</p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea placeholder="Tell us more..." rows={6} />
              </div>
              <Button size="lg" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
                <MessageSquare className="mr-2" size={20} />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
