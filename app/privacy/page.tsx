import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-12 h-12 text-emerald-600" />
          <h1 className="text-5xl font-bold">Privacy Policy</h1>
        </div>
        
        <p className="text-foreground/60 mb-12">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-foreground/80 leading-relaxed">
              We collect information you provide directly to us, including name, email address, company information, 
              and payment details. We also automatically collect certain information about your device and how you 
              interact with our services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. Data Security</h2>
            <p className="text-foreground/80 leading-relaxed">
              We implement industry-standard security measures including 256-bit encryption, SOC 2 Type II certification, 
              and regular security audits. Your financial data is stored in secure, encrypted databases with restricted access.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Data Retention</h2>
            <p className="text-foreground/80 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. 
              We will retain and use your information as necessary to comply with legal obligations and resolve disputes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-foreground/80 leading-relaxed">
              You have the right to access, update, or delete your personal information. You can also object to 
              processing of your data or request data portability. Contact us at privacy@payflow.com to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at privacy@payflow.com or 
              write to us at PayFlow Inc., San Francisco, CA.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
