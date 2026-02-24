import Link from 'next/link'
import { ArrowLeft, Code, Key, Zap, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ApiReferencePage() {
  const endpoints = [
    { method: 'GET', path: '/api/v1/employees', description: 'List all employees' },
    { method: 'POST', path: '/api/v1/employees', description: 'Create new employee' },
    { method: 'GET', path: '/api/v1/payroll', description: 'Get payroll records' },
    { method: 'POST', path: '/api/v1/payroll/run', description: 'Process payroll' },
    { method: 'GET', path: '/api/v1/invoices', description: 'List invoices' },
    { method: 'POST', path: '/api/v1/invoices', description: 'Create invoice' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-6">API Reference</h1>
        <p className="text-xl text-foreground/70 mb-12">
          Complete API documentation for PayFlow integration
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Key className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Authentication</h3>
            <p className="text-sm text-foreground/60">OAuth 2.0 & API Keys</p>
          </Card>
          <Card className="p-6 text-center">
            <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Rate Limits</h3>
            <p className="text-sm text-foreground/60">1000 requests/hour</p>
          </Card>
          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Security</h3>
            <p className="text-sm text-foreground/60">TLS 1.3 Encryption</p>
          </Card>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-emerald-600" />
            API Endpoints
          </h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/40">
                <span className={`px-3 py-1 rounded text-xs font-bold ${
                  endpoint.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {endpoint.method}
                </span>
                <code className="flex-1 text-sm font-mono">{endpoint.path}</code>
                <span className="text-sm text-foreground/60">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
          <h3 className="text-xl font-bold mb-4">Getting Started</h3>
          <p className="text-foreground/70 mb-4">
            To get started with the PayFlow API, you'll need to generate an API key from your dashboard.
          </p>
          <code className="block p-4 bg-background/80 rounded-lg text-sm font-mono">
            curl -H "Authorization: Bearer YOUR_API_KEY" https://api.payflow.com/v1/employees
          </code>
        </Card>
      </div>
    </div>
  )
}
