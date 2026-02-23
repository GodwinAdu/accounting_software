"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Wallet, CreditCard } from "lucide-react"
import { createInvoicePayment, getAvailablePaymentMethods } from "@/lib/actions/payment.action"
import { AccountSelector } from "@/components/forms/account-selector"
import { toast } from "sonner"

interface RecordPaymentModalProps {
  open: boolean
  onClose: () => void
  invoiceId: string
  amount: number
  currency: string
  customerEmail: string
}

export function RecordPaymentModal({
  open,
  onClose,
  invoiceId,
  amount,
  currency,
  customerEmail,
}: RecordPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentType, setPaymentType] = useState<"manual" | "gateway">("manual")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [gateways, setGateways] = useState<any[]>([])
  const [selectedGateway, setSelectedGateway] = useState<string>()
  const [bankAccountId, setBankAccountId] = useState<string>("")
  const [receivableAccountId, setReceivableAccountId] = useState<string>("")

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

  const handleSubmit = async () => {
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
        onClose()
        
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
        bankAccountId: bankAccountId || undefined,
        receivableAccountId: receivableAccountId || undefined,
      })
      setIsLoading(false)

      if (result.success) {
        toast.success("Payment recorded successfully")
        onClose()
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to record payment")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold text-emerald-600">
              {currency} {amount.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Type</Label>
            <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as "manual" | "gateway")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual" className="font-normal cursor-pointer">
                  💵 Record Manual Payment
                </Label>
              </div>
              {gateways.length > 0 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gateway" id="gateway" />
                  <Label htmlFor="gateway" className="font-normal cursor-pointer">
                    💳 Pay via Gateway
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {paymentType === "manual" ? (
            <>
              <div className="space-y-2">
                <Label>Payment Method</Label>
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

              <div className="space-y-3 pt-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Accounting (Optional)</div>
                <AccountSelector
                  label="Bank/Cash Account"
                  accountType="asset"
                  value={bankAccountId}
                  onChange={setBankAccountId}
                  placeholder="Default: Cash"
                />
                <AccountSelector
                  label="Accounts Receivable"
                  accountType="asset"
                  value={receivableAccountId}
                  onChange={setReceivableAccountId}
                  placeholder="Default: Accounts Receivable"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Select value={selectedGateway} onValueChange={setSelectedGateway}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway.provider} value={gateway.provider}>
                      {gateway.provider.charAt(0).toUpperCase() + gateway.provider.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : paymentType === "manual" ? (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Record Payment
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
