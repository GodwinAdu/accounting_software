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
        
        <p className="text-foreground/60 mb-12">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing or using SyncBooks (&quot;Service,&quot; &quot;Platform,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these 
              Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service. 
              These Terms apply to all users, including organizations, employees, and administrators. By creating an account, 
              you represent that you are at least 18 years old and have the authority to bind your organization to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Service Description</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              SyncBooks provides a cloud-based platform for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Accounting:</strong> Chart of accounts, journal entries, general ledger, financial statements</li>
              <li><strong>Invoicing:</strong> Create, send, and track invoices and quotes</li>
              <li><strong>Expense Management:</strong> Track expenses, receipts, and vendor payments</li>
              <li><strong>Payroll:</strong> Employee management, salary processing, tax calculations</li>
              <li><strong>Banking:</strong> Bank reconciliation, transaction management</li>
              <li><strong>Reporting:</strong> Financial reports, analytics, and dashboards</li>
              <li><strong>AI Features:</strong> Financial insights, expense categorization, forecasting, anomaly detection</li>
              <li><strong>Tax Management:</strong> VAT/GST calculations, tax reporting, compliance tools</li>
              <li><strong>Multi-user Access:</strong> Role-based permissions, team collaboration</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We reserve the right to modify, suspend, or discontinue any feature with 30 days' notice for material changes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-foreground/80 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Use a strong password and enable two-factor authentication (2FA)</li>
              <li>Not share your account credentials with unauthorized persons</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">3.2 Account Responsibility</h3>
            <p className="text-foreground/80 leading-relaxed">
              You are responsible for all activities under your account. We are not liable for losses resulting from 
              unauthorized use of your credentials. You must maintain the confidentiality of sensitive financial data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Acceptable Use Policy</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Use the Service for any illegal purpose or violate any laws</li>
              <li>Upload malicious code, viruses, or harmful software</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use automated tools to scrape or extract data without permission</li>
              <li>Resell, sublicense, or redistribute the Service without authorization</li>
              <li>Abuse AI features by submitting excessive requests or attempting to bypass rate limits</li>
              <li>Share AI conversations containing sensitive personal or financial information publicly</li>
              <li>Use the Service to process data for third parties without a reseller agreement</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Violation of this policy may result in immediate account suspension or termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Subscription and Payment Terms</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">5.1 Pricing and Plans</h3>
            <p className="text-foreground/80 leading-relaxed">
              SyncBooks offers multiple subscription tiers (Starter, Professional, Enterprise) with different features and limits. 
              Current pricing is available at <a href="/" className="text-emerald-600 hover:underline">syncbooks.com</a>. Prices are in GHS (Ghana Cedis) or USD.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.2 Billing</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Subscriptions are billed monthly or annually in advance</li>
              <li>Payment is due immediately upon subscription or renewal</li>
              <li>We accept credit cards, debit cards, and mobile money (MTN, Vodafone, AirtelTigo)</li>
              <li>Failed payments may result in service suspension after 7 days grace period</li>
              <li>You authorize us to charge your payment method automatically for renewals</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.3 Price Changes</h3>
            <p className="text-foreground/80 leading-relaxed">
              We may change pricing with 30 days' notice. Price changes apply to subsequent billing cycles. 
              Existing subscribers are grandfathered for 12 months on annual plans.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.4 Refund Policy</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>14-Day Money-Back Guarantee:</strong> Full refund if you cancel within 14 days of first subscription</li>
              <li><strong>No Refunds:</strong> After 14 days, all fees are non-refundable</li>
              <li><strong>Pro-Rata Credits:</strong> Downgrades receive credit for unused time applied to next billing cycle</li>
              <li><strong>Service Issues:</strong> Refunds considered on case-by-case basis for extended outages (&gt;24 hours)</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">5.5 Taxes</h3>
            <p className="text-foreground/80 leading-relaxed">
              Prices exclude applicable taxes (VAT, GST). You are responsible for all taxes. We will add taxes to invoices as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. AI Features Terms</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">6.1 AI Service Availability</h3>
            <p className="text-foreground/80 leading-relaxed">
              AI features require an active AI module subscription. Features include financial insights, expense categorization, 
              invoice data extraction, anomaly detection, forecasting, and conversational AI assistant.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">6.2 AI Limitations and Disclaimers</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>AI-generated content is for informational purposes only, not professional advice</li>
              <li>AI may produce inaccurate, incomplete, or outdated information</li>
              <li>You must verify all AI suggestions before making financial decisions</li>
              <li>We are not liable for losses resulting from reliance on AI outputs</li>
              <li>AI features do not replace professional accountants, tax advisors, or legal counsel</li>
              <li>Usage limits apply: 500 AI requests per month (Starter), 2,000 (Professional), unlimited (Enterprise)</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">6.3 AI Data Processing</h3>
            <p className="text-foreground/80 leading-relaxed">
              AI features use OpenAI's API. Your prompts and financial data summaries are processed by OpenAI according to their 
              <a href="https://openai.com/policies/business-terms" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline"> Business Terms</a>. 
              OpenAI does not use your data for model training.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">6.4 Shared Conversations</h3>
            <p className="text-foreground/80 leading-relaxed">
              When you share an AI conversation, it becomes publicly accessible. You are responsible for ensuring shared content 
              does not contain confidential information. We are not liable for unauthorized access to shared conversations.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">6.5 Content Ownership</h3>
            <p className="text-foreground/80 leading-relaxed">
              You own your input prompts. AI-generated responses are provided under a non-exclusive license for your business use. 
              You may not resell or redistribute AI outputs as a standalone product.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Data Ownership and Usage Rights</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">7.1 Your Data</h3>
            <p className="text-foreground/80 leading-relaxed">
              You retain all ownership rights to your financial data, customer information, and content. We do not claim ownership 
              of your data. You grant us a limited license to process your data solely to provide the Service.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">7.2 Data Export</h3>
            <p className="text-foreground/80 leading-relaxed">
              You can export your data anytime in CSV, Excel, JSON, or PDF format. Upon account closure, you have 30 days to export data.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">7.3 Aggregated Data</h3>
            <p className="text-foreground/80 leading-relaxed">
              We may use anonymized, aggregated data for analytics, benchmarking, and service improvement. This data cannot identify you or your organization.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Intellectual Property Rights</h2>
            <p className="text-foreground/80 leading-relaxed">
              The Service, including software, design, logos, trademarks, and content, is owned by SyncBooks and protected by 
              copyright, trademark, and intellectual property laws. You may not copy, modify, distribute, or create derivative works 
              without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Service Level Agreement (SLA)</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">9.1 Uptime</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Professional & Enterprise:</strong> 99.5% monthly uptime target</li>
              <li><strong>Starter:</strong> Best effort, no uptime guarantee</li>
              <li>Scheduled maintenance excluded from uptime calculation (notified 48 hours in advance)</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">9.2 Support</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Starter:</strong> Email support, 48-hour response time</li>
              <li><strong>Professional:</strong> Email & chat support, 24-hour response time</li>
              <li><strong>Enterprise:</strong> Priority support, 4-hour response time, dedicated account manager</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">9.3 Service Credits</h3>
            <p className="text-foreground/80 leading-relaxed">
              If uptime falls below 99.5%, Professional and Enterprise customers may be eligible for service credits on a case-by-case basis. 
              Contact support to request a review.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>SyncBooks is provided &quot;AS IS&quot; without warranties of any kind, express or implied</li>
              <li>We do not guarantee error-free, uninterrupted, or secure service</li>
              <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability is limited to the amount you paid in the 12 months preceding the claim</li>
              <li>We are not liable for third-party services (OpenAI, payment processors, hosting providers)</li>
              <li>We are not liable for data loss if you fail to maintain backups</li>
              <li>We are not liable for tax penalties, compliance violations, or financial losses from using the Service</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Indemnification</h2>
            <p className="text-foreground/80 leading-relaxed">
              You agree to indemnify and hold harmless SyncBooks, its affiliates, officers, and employees from any claims, 
              damages, losses, or expenses (including legal fees) arising from: (a) your use of the Service, (b) violation of 
              these Terms, (c) violation of any law or third-party rights, (d) your data or content.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Termination</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">12.1 Termination by You</h3>
            <p className="text-foreground/80 leading-relaxed">
              You may cancel your subscription anytime through account settings. Cancellation takes effect at the end of the current billing period. 
              No refunds for partial months.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">12.2 Termination by Us</h3>
            <p className="text-foreground/80 leading-relaxed mb-4">We may suspend or terminate your account immediately if:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>You breach these Terms or Acceptable Use Policy</li>
              <li>Payment fails after 7-day grace period</li>
              <li>We detect fraudulent or illegal activity</li>
              <li>Required by law or government order</li>
              <li>Account inactive for 12+ months</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">12.3 Effect of Termination</h3>
            <p className="text-foreground/80 leading-relaxed">
              Upon termination: (a) access to the Service ends immediately, (b) you have 30 days to export data, 
              (c) we may delete your data after 30 days, (d) outstanding fees remain due.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">13. Dispute Resolution and Governing Law</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">13.1 Governing Law</h3>
            <p className="text-foreground/80 leading-relaxed">
              These Terms are governed by the laws of Ghana. Any disputes shall be resolved in the courts of Accra, Ghana.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">13.2 Dispute Resolution Process</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
              <li><strong>Informal Resolution:</strong> Contact <a href="mailto:legal@syncbooks.com" className="text-emerald-600 hover:underline">legal@syncbooks.com</a> to resolve disputes informally (30 days)</li>
              <li><strong>Mediation:</strong> If unresolved, parties agree to mediation before litigation</li>
              <li><strong>Arbitration:</strong> Disputes may be submitted to binding arbitration under Ghana Arbitration Act</li>
              <li><strong>Litigation:</strong> As a last resort, disputes resolved in Accra courts</li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">14. Changes to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may update these Terms periodically. Material changes will be notified via email and in-app notification 30 days 
              before taking effect. Continued use after changes constitutes acceptance. If you disagree, you must cancel your subscription.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">15. Miscellaneous</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">15.1 Entire Agreement</h3>
            <p className="text-foreground/80 leading-relaxed">
              These Terms, Privacy Policy, and any additional agreements constitute the entire agreement between you and SyncBooks.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">15.2 Severability</h3>
            <p className="text-foreground/80 leading-relaxed">
              If any provision is found unenforceable, the remaining provisions remain in effect.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">15.3 Waiver</h3>
            <p className="text-foreground/80 leading-relaxed">
              Failure to enforce any provision does not constitute a waiver of that provision.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">15.4 Assignment</h3>
            <p className="text-foreground/80 leading-relaxed">
              You may not assign these Terms without our consent. We may assign these Terms to any successor or affiliate.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-6">15.5 Force Majeure</h3>
            <p className="text-foreground/80 leading-relaxed">
              We are not liable for delays or failures due to circumstances beyond our control (natural disasters, war, pandemics, 
              internet outages, third-party service failures).
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">16. Contact Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              For questions about these Terms:
            </p>
            <ul className="list-none space-y-2 text-foreground/80">
              <li><strong>Legal:</strong> <a href="mailto:legal@syncbooks.com" className="text-emerald-600 hover:underline">legal@syncbooks.com</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@syncbooks.com" className="text-emerald-600 hover:underline">support@syncbooks.com</a></li>
              <li><strong>Sales:</strong> <a href="mailto:sales@syncbooks.com" className="text-emerald-600 hover:underline">sales@syncbooks.com</a></li>
              <li><strong>Address:</strong> SyncBooks Ltd., Accra, Ghana</li>
              <li><strong>Phone:</strong> +233 XX XXX XXXX</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>View our pricing:</strong> Visit our <a href="/pricing" className="text-emerald-600 hover:underline font-semibold">Pricing Page</a> for detailed information about subscription plans, module pricing, and billing options.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
