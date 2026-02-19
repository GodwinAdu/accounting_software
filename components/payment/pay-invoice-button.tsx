"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createInvoicePayment, getAvailablePaymentMethods } from "@/lib/actions/payment.action"
import { toast } from "sonner"
import { Loader2, CreditCard } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PayInvoiceButtonProps {
  invoiceId: string
  amount: number
  currency: string
  customerEmail: string
}

const gatewayIcons: Record<string, string> = {
  stripe: "💳",
  paystack: "💰",
  flutterwave: "🦋",
}

export default function PayInvoiceButton({ invoiceId, amount, currency, customerEmail }: PayInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [gateways, setGateways] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>()

  useEffect(() => {
    const fetchGateways = async () => {
      const result = await getAvailablePaymentMethods()
      if (result.success && result.gateways) {
        setGateways(result.gateways)
        if (result.gateways.length === 1) {
          setSelectedProvider(result.gateways[0].provider)
        }
      }
    }
    fetchGateways()
  }, [])

  const handlePayment = async () => {
    if (!selectedProvider && gateways.length > 1) {
      toast.error("Please select a payment method")
      return
    }

    setIsLoading(true)
    const result = await createInvoicePayment({
      invoiceId,
      amount,
      currency,
      customerEmail,
      provider: selectedProvider,
    })
    setIsLoading(false)

    if (result.success) {
      const payment = result.payment as any
      
      if (payment.authorization_url) {
        window.location.href = payment.authorization_url
      } else if (payment.data?.link) {
        window.location.href = payment.data.link
      } else if (payment.client_secret) {
        toast.success("Payment initialized")
      }
    } else {
      toast.error(result.error || "Failed to process payment")
    }
  }

  if (gateways.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {gateways.length > 1 && (
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {gateways.map((gateway) => (
              <SelectItem key={gateway.provider} value={gateway.provider}>
                {gatewayIcons[gateway.provider]} {gateway.provider.charAt(0).toUpperCase() + gateway.provider.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {currency} {amount.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  )
}
