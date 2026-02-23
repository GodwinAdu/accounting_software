"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createInvoicePayment, getAvailablePaymentMethods } from "@/lib/actions/payment.action"
import { toast } from "sonner"
import { Loader2, CreditCard, Wallet } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  manual: "💵",
}

export default function PayInvoiceButton({ invoiceId, amount, currency, customerEmail }: PayInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [gateways, setGateways] = useState<any[]>([])
  const [paymentType, setPaymentType] = useState<"gateway" | "manual">("manual")
  const [selectedGateway, setSelectedGateway] = useState<string>()
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")

  useEffect(() => {
    const fetchGateways = async () => {
      const result = await getAvailablePaymentMethods()
      if (result.success && result.gateways && result.gateways.length > 0) {
        setGateways(result.gateways)
        setSelectedGateway(result.gateways[0].provider)
      }
    }
    fetchGateways()
  }, [])

  const handlePayment = async () => {
    if (paymentType === "gateway") {
      if (!selectedGateway) {
        toast.error("Please select a payment gateway")
        return
      }

      setIsLoading(true)
      const result = await createInvoicePayment({
        invoiceId,
        amount,
        currency,
        customerEmail,
        provider: selectedGateway,
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
    } else {
      // Manual payment
      setIsLoading(true)
      const result = await createInvoicePayment({
        invoiceId,
        amount,
        currency,
        customerEmail,
        provider: "manual",
        paymentMethod,
      })
      setIsLoading(false)

      if (result.success) {
        toast.success("Payment recorded successfully")
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to record payment")
      }
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Payment Type</Label>
        <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as "gateway" | "manual")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual" className="font-normal cursor-pointer">
              💵 Record Manual Payment (Cash, Bank Transfer, etc.)
            </Label>
          </div>
          {gateways.length > 0 && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gateway" id="gateway" />
              <Label htmlFor="gateway" className="font-normal cursor-pointer">
                💳 Pay Online (Card, Mobile Money)
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>

      {paymentType === "manual" ? (
        <div>
          <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">💵 Cash</SelectItem>
              <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
              <SelectItem value="mobile_money">📱 Mobile Money</SelectItem>
              <SelectItem value="cheque">📝 Cheque</SelectItem>
              <SelectItem value="card">💳 Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label className="text-sm font-medium mb-2 block">Payment Gateway</Label>
          <Select value={selectedGateway} onValueChange={setSelectedGateway}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gateways.map((gateway) => (
                <SelectItem key={gateway.provider} value={gateway.provider}>
                  {gatewayIcons[gateway.provider]} {gateway.provider.charAt(0).toUpperCase() + gateway.provider.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : paymentType === "manual" ? (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Record Payment - {currency} {amount.toFixed(2)}
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
