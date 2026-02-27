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
        
        <p className="text-foreground/60 mb-12">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
            <p className="text-foreground/80 leading-relaxed">
              SyncBooks (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our cloud-based accounting, payroll, and AI-powered 
              financial management platform. This policy complies with the Ghana Data Protection Act, 2012 (Act 843) and 
              international data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Account Information:</strong> Name, email address, phone number, company name, business registration details</li>
              <li><strong>Financial Data:</strong> Bank account details, transaction records, invoices, expenses, payroll information, tax records</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through third-party payment processors)</li>
              <li><strong>Employee Data:</strong> Names, contact details, salary information, tax identification numbers, employment records</li>
              <li><strong>AI Interaction Data:</strong> Questions, prompts, and conversations with our AI assistant</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
              <li><strong>Log Data:</strong> Access times, error logs, system activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We use collected information for:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Service Delivery:</strong> Provide accounting, payroll, invoicing, expense tracking, and reporting features</li>
              <li><strong>AI Features:</strong> Process your queries through OpenAI's API to provide financial insights, expense categorization, anomaly detection, and forecasting</li>
              <li><strong>Account Management:</strong> Create and manage your account, authenticate users, process payments</li>
              <li><strong>Communication:</strong> Send transactional emails, service updates, security alerts, and support responses</li>
              <li><strong>Improvement:</strong> Analyze usage patterns to enhance features, fix bugs, and optimize performance</li>
              <li><strong>Security:</strong> Detect fraud, prevent unauthorized access, ensure data integrity</li>
              <li><strong>Compliance:</strong> Meet legal obligations, tax reporting requirements, and regulatory standards</li>
              <li><strong>Marketing:</strong> Send promotional content (with your consent, which you can withdraw anytime)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. AI Data Processing</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Our AI features are powered by OpenAI's GPT models. When you use AI features:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Your prompts and financial data summaries are sent to OpenAI's API for processing</li>
              <li>OpenAI processes this data according to their <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Privacy Policy</a> and <a href="https://openai.com/policies/business-terms" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Business Terms</a></li>
              <li>OpenAI does not use your data to train their models (as per their enterprise agreement)</li>
              <li>AI conversations are stored in our secure database for your reference</li>
              <li>You can delete AI conversations at any time from your dashboard</li>
              <li>Shared AI conversations are publicly accessible via unique links until you revoke sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We share your information only in these circumstances:</p>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">5.1 Third-Party Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>OpenAI:</strong> AI processing and natural language understanding</li>
              <li><strong>Payment Processors:</strong> Stripe, PayPal for payment processing</li>
              <li><strong>Cloud Hosting:</strong> AWS, Vercel for infrastructure and hosting</li>
              <li><strong>Email Services:</strong> For transactional and notification emails</li>
              <li><strong>Analytics:</strong> Google Analytics, Mixpanel for usage analytics (anonymized)</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.2 Legal Requirements</h3>
            <p className="text-foreground/80 leading-relaxed">
              We may disclose information to comply with legal obligations, court orders, government requests, 
              or to protect our rights, safety, and property.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.3 Business Transfers</h3>
            <p className="text-foreground/80 leading-relaxed">
              In case of merger, acquisition, or sale of assets, your information may be transferred to the new entity.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.4 Shared Conversations</h3>
            <p className="text-foreground/80 leading-relaxed">
              When you share an AI conversation, it becomes publicly accessible to anyone with the share link. 
              Shared conversations do not include your personal information but contain the conversation content.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Data Security</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We implement comprehensive security measures:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Encryption:</strong> AES-256-CBC encryption for sensitive data (API keys, bank accounts, passwords), HTTPS/TLS for data in transit</li>
              <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication (2FA), session management</li>
              <li><strong>Authentication:</strong> Secure JWT-based authentication with refresh tokens</li>
              <li><strong>Infrastructure:</strong> Secure cloud hosting with regular security updates</li>
              <li><strong>Monitoring:</strong> Activity logging and audit trails</li>
              <li><strong>Best Practices:</strong> Following industry-standard security practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Data Retention</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We retain your data as follows:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Closed Accounts:</strong> Financial records retained for 7 years (Ghana tax law requirement)</li>
              <li><strong>AI Conversations:</strong> Retained until you delete them or close your account</li>
              <li><strong>Audit Logs:</strong> Retained for 2 years for security and compliance</li>
              <li><strong>Backups:</strong> Deleted data removed from backups within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Your Rights (Ghana Data Protection Act)</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">Under Ghana's data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (subject to legal retention requirements)</li>
              <li><strong>Portability:</strong> Export your data in CSV, JSON, or Excel format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
              <li><strong>Withdraw Consent:</strong> Revoke consent for optional data processing</li>
              <li><strong>Lodge Complaint:</strong> File a complaint with the Data Protection Commission of Ghana</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@syncbooks.com" className="text-emerald-600 hover:underline">privacy@syncbooks.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. International Data Transfers</h2>
            <p className="text-foreground/80 leading-relaxed">
              Your data may be transferred to and processed in countries outside Ghana, including the United States 
              (OpenAI servers). We ensure adequate safeguards through standard contractual clauses and data processing 
              agreements that meet international standards.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Cookies and Tracking</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Essential Cookies:</strong> Authentication, security, session management (cannot be disabled)</li>
              <li><strong>Functional Cookies:</strong> Remember preferences, language settings</li>
              <li><strong>Analytics Cookies:</strong> Understand usage patterns, improve features (can be disabled)</li>
              <li><strong>Marketing Cookies:</strong> Personalized advertising (requires consent)</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              You can manage cookie preferences in your browser settings or through our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Children's Privacy</h2>
            <p className="text-foreground/80 leading-relaxed">
              SyncBooks is not intended for individuals under 18 years of age. We do not knowingly collect data from children. 
              If you believe we have collected data from a child, contact us immediately for deletion.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Changes to This Policy</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may update this Privacy Policy periodically. Material changes will be notified via email and in-app notification 
              30 days before taking effect. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              For privacy-related questions, requests, or complaints:
            </p>
            <ul className="list-none space-y-2 text-foreground/80">
              <li><strong>Email:</strong> <a href="mailto:privacy@syncbooks.com" className="text-emerald-600 hover:underline">privacy@syncbooks.com</a></li>
              <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@syncbooks.com" className="text-emerald-600 hover:underline">dpo@syncbooks.com</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@syncbooks.com" className="text-emerald-600 hover:underline">support@syncbooks.com</a></li>
              <li><strong>Address:</strong> SyncBooks Ltd., Accra, Ghana</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>Data Protection Commission (Ghana):</strong> If you're not satisfied with our response, you can lodge a complaint at <a href="https://www.dataprotection.org.gh" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">www.dataprotection.org.gh</a>
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>Learn more about our pricing:</strong> Visit our <a href="/pricing" className="text-emerald-600 hover:underline font-semibold">Pricing Page</a> to understand our subscription plans and module-based pricing.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
