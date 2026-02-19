"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { connectIntegration, disconnectIntegration } from "@/lib/actions/integration.action"
import { toast } from "sonner"
import { Loader2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: "connected" | "disconnected"
}

const integrationGuides: Record<string, { apiUrl: string; secretUrl: string; webhookUrl: string; steps: string[] }> = {
  stripe: {
    apiUrl: "https://dashboard.stripe.com/apikeys",
    secretUrl: "https://dashboard.stripe.com/apikeys",
    webhookUrl: "https://dashboard.stripe.com/webhooks",
    steps: [
      "Go to Stripe Dashboard → Developers → API keys",
      "Copy your Secret key (starts with sk_)",
      "For webhooks, go to Webhooks section and add endpoint",
      "Use webhook signing secret for verification",
    ],
  },
  paystack: {
    apiUrl: "https://dashboard.paystack.com/#/settings/developers",
    secretUrl: "https://dashboard.paystack.com/#/settings/developers",
    webhookUrl: "https://dashboard.paystack.com/#/settings/developers",
    steps: [
      "Login to Paystack Dashboard",
      "Go to Settings → API Keys & Webhooks",
      "Copy your Secret Key (starts with sk_)",
      "Add webhook URL in the Webhooks section",
    ],
  },
  flutterwave: {
    apiUrl: "https://dashboard.flutterwave.com/settings/apis",
    secretUrl: "https://dashboard.flutterwave.com/settings/apis",
    webhookUrl: "https://dashboard.flutterwave.com/settings/webhooks",
    steps: [
      "Login to Flutterwave Dashboard",
      "Go to Settings → API",
      "Copy your Secret Key",
      "Configure webhook URL in Settings → Webhooks",
    ],
  },
  "aws-s3": {
    apiUrl: "https://console.aws.amazon.com/iam/home#/security_credentials",
    secretUrl: "https://console.aws.amazon.com/iam/home#/security_credentials",
    webhookUrl: "",
    steps: [
      "Login to AWS Console",
      "Go to IAM → Users → Security credentials",
      "Create Access Key (API Key = Access Key ID)",
      "Save Secret Access Key (shown only once)",
      "Create S3 bucket and note the region",
    ],
  },
}

export default function IntegrationCard({ integration }: { integration: Integration }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
  })

  const guide = integrationGuides[integration.id]

  const handleConnect = async () => {
    setIsLoading(true)
    const result = await connectIntegration({
      provider: integration.id,
      category: integration.category,
      credentials,
    })
    setIsLoading(false)

    if (result.success) {
      toast.success(`${integration.name} connected successfully`)
      setIsOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to connect integration")
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    const result = await disconnectIntegration(integration.id)
    setIsLoading(false)

    if (result.success) {
      toast.success(`${integration.name} disconnected`)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to disconnect")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{integration.icon}</div>
              <div>
                <CardTitle className="text-base">{integration.name}</CardTitle>
                <Badge variant={integration.status === "connected" ? "default" : "secondary"} className="mt-1">
                  {integration.status}
                </Badge>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2">{integration.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {integration.status === "connected" ? (
            <Button variant="outline" className="w-full" onClick={handleDisconnect} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disconnect
            </Button>
          ) : (
            <>
              <Button className="w-full" onClick={() => setIsOpen(true)}>
                Connect
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowGuide(true)}>
                <Info className="mr-2 h-4 w-4" />
                Setup Guide
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {integration.name}</DialogTitle>
            <DialogDescription>Enter your API credentials to connect {integration.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey">API Key</Label>
                {guide && (
                  <a href={guide.apiUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Get API Key →
                  </a>
                )}
              </div>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiSecret">API Secret</Label>
                {guide && (
                  <a href={guide.secretUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Get Secret →
                  </a>
                )}
              </div>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={credentials.apiSecret}
                onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                {guide?.webhookUrl && (
                  <a href={guide.webhookUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Configure →
                  </a>
                )}
              </div>
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook-url.com"
                value={credentials.webhookUrl}
                onChange={(e) => setCredentials({ ...credentials, webhookUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isLoading || !credentials.apiKey || !credentials.apiSecret}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{integration.name} Setup Guide</DialogTitle>
            <DialogDescription>Follow these steps to get your API credentials</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You'll need API credentials from {integration.name} to connect this integration.
              </AlertDescription>
            </Alert>
            {guide && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <p className="text-sm font-medium">Quick Links:</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={guide.apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      → Get API Keys
                    </a>
                    {guide.webhookUrl && (
                      <a
                        href={guide.webhookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        → Configure Webhooks
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setShowGuide(false)
              setIsOpen(true)
            }}>
              Continue to Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
