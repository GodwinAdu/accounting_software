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
import { Loader2 } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: "connected" | "disconnected"
}

export default function IntegrationCard({ integration }: { integration: Integration }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
  })

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
        <CardContent>
          {integration.status === "connected" ? (
            <Button variant="outline" className="w-full" onClick={handleDisconnect} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disconnect
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setIsOpen(true)}>
              Connect
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {integration.name}</DialogTitle>
            <DialogDescription>Enter your API credentials to connect {integration.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={credentials.apiSecret}
                onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
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
    </>
  )
}
