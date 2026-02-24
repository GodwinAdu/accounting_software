import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-12 h-12 text-emerald-600" />
          <h1 className="text-5xl font-bold">Terms of Service</h1>
        </div>
        
        <p className="text-foreground/60 mb-12">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing and using PayFlow's services, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Service Description</h2>
            <p className="text-foreground/80 leading-relaxed">
              PayFlow provides cloud-based payroll and accounting software. We reserve the right to modify, suspend, 
              or discontinue any part of the service at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not interfere with or disrupt the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Payment Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable 
              except as required by law. We reserve the right to change pricing with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="text-foreground/80 leading-relaxed">
              All content, features, and functionality of PayFlow are owned by us and protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed">
              PayFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Termination</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may terminate or suspend your account immediately if you breach these Terms. You may cancel your 
              subscription at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Contact</h2>
            <p className="text-foreground/80 leading-relaxed">
              For questions about these Terms, contact us at legal@payflow.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
