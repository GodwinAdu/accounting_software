"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Check, AlertCircle, Crown } from "lucide-react"
import { toast } from "sonner"
import {
  getSubscription,
  calculateSubscriptionAmount,
  initializePayment,
  updateSubscription,
  updateModules,
  verifyPayment,
} from "@/lib/actions/subscription.action"

const MODULES = [
  { key: "sales", name: "Sales & Invoicing", price: 30, description: "Manage invoices, customers, and sales" },
  { key: "expenses", name: "Expenses & Bills", price: 25, description: "Track expenses, bills, and vendors" },
  { key: "payroll", name: "Payroll", price: 50, description: "Employee payroll and time tracking" },
  { key: "tax", name: "Tax Management", price: 35, description: "Tax settings and compliance" },
  { key: "products", name: "Products & Inventory", price: 20, description: "Product catalog and stock management" },
  { key: "projects", name: "Projects", price: 25, description: "Project management and tracking" },
  { key: "crm", name: "CRM", price: 30, description: "Customer relationship management" },
  { key: "budgeting", name: "Budgeting", price: 40, description: "Budget planning and forecasting" },
  { key: "assets", name: "Fixed Assets", price: 20, description: "Asset management and depreciation" },
  { key: "loans", name: "Loans", price: 25, description: "Loan management and tracking" },
  { key: "equity", name: "Equity", price: 20, description: "Equity transactions and owner investments" },
  { key: "ai", name: "AI Assistant", price: 50, description: "AI-powered insights and automation" },
]

const PLAN_PRICING: Record<string, number> = {
  starter: 150,
  professional: 400,
  enterprise: 0,
}

const PLANS = [
  { key: "starter", name: "Starter", price: 150, description: "Perfect for small businesses" },
  { key: "professional", name: "Professional", price: 400, description: "For growing companies" },
  { key: "enterprise", name: "Enterprise", price: 0, description: "Custom pricing for large organizations" },
]

const BILLING_PERIODS = [
  { key: "trial", label: "Trial", months: 0, discount: 0, isTrial: true },
  { key: "1", label: "1 Month", months: 1, discount: 0 },
  { key: "3", label: "3 Months", months: 3, discount: 5 },
  { key: "6", label: "6 Months", months: 6, discount: 10 },
  { key: "12", label: "1 Year", months: 12, discount: 15 },
]

export default function SubscriptionTab({ organization }: { organization: any }) {
  const pathname = usePathname()
  const [modules, setModules] = useState<Record<string, boolean>>({})
  const [originalModules, setOriginalModules] = useState<Record<string, boolean>>({})
  const [subscriptionPlan, setSubscriptionPlan] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState("trial")

  useEffect(() => {
    loadSubscription()
  }, [])

  useEffect(() => {
    calculateAmount()
  }, [modules])

  const loadSubscription = async () => {
    try {
      const data = await getSubscription()
      setModules(data.modules || {})
      setOriginalModules(data.modules || {})
      setSubscriptionPlan(data.subscriptionPlan)
      setSelectedPlan(data.subscriptionPlan?.plan || "starter")
      setBillingPeriod(data.subscriptionPlan?.status === "trial" ? "trial" : "1")
    } catch (error: any) {
      toast.error("Failed to load subscription", { description: error.message })
    }
  }

  const calculateAmount = async () => {
    try {
      setCalculating(true)
      const { amount } = await calculateSubscriptionAmount(modules)
      setTotalAmount(amount)
    } catch (error: any) {
      console.error(error)
    } finally {
      setCalculating(false)
    }
  }

  const getBasePlanPrice = () => PLAN_PRICING[selectedPlan] || 150

  const getModulesPrice = () => {
    return MODULES.reduce((sum, module) => {
      return sum + (modules[module.key] ? module.price : 0)
    }, 0)
  }

  const getMonthlyTotal = () => getBasePlanPrice() + getModulesPrice()

  const getSelectedPeriod = () => BILLING_PERIODS.find(p => p.key === billingPeriod) || BILLING_PERIODS[0]

  const getSubtotal = () => getMonthlyTotal() * getSelectedPeriod().months

  const getDiscount = () => (getSubtotal() * getSelectedPeriod().discount) / 100

  const getFinalAmount = () => getSubtotal() - getDiscount()

  const handleModuleToggle = async (moduleKey: string, enabled: boolean) => {
    setModules((prev) => ({ ...prev, [moduleKey]: enabled }))
    try {
      await updateModules({ [moduleKey]: enabled }, pathname)
      toast.success("Module updated")
    } catch (error: any) {
      setModules((prev) => ({ ...prev, [moduleKey]: !enabled }))
      toast.error("Failed to update module", { description: error.message })
    }
  }

  const hasChanges = () => {
    return JSON.stringify(modules) !== JSON.stringify(originalModules) || selectedPlan !== subscriptionPlan?.plan
  }

  const isAtHighestPlan = () => {
    return subscriptionPlan?.plan === "professional" && selectedPlan === "professional"
  }

  const canPay = () => {
    if (loading) return false
    if (selectedPlan === "enterprise") return false
    if (billingPeriod === "trial") return false
    // Allow payment when upgrading from trial
    if (subscriptionPlan?.status === "trial" && billingPeriod !== "trial") return true
    // Always allow payment if billing period is selected (for renewals)
    if (billingPeriod !== "1") return true
    // Allow payment if there are any changes
    if (hasChanges()) return true
    return false
  }

  const getPayButtonText = () => {
    if (loading) return { icon: Loader2, text: "Processing..." }
    if (selectedPlan === "enterprise") return { icon: AlertCircle, text: "Contact Sales for Enterprise" }
    if (billingPeriod === "trial") return { icon: Check, text: "Currently on Trial" }
    // Show payment button when upgrading from trial
    if (subscriptionPlan?.status === "trial" && billingPeriod !== "trial") {
      return { icon: CreditCard, text: `Pay GHS ${getFinalAmount().toFixed(2)} with Paystack` }
    }
    if (!hasChanges() && billingPeriod === "1") return { icon: Check, text: "No Changes" }
    return { icon: CreditCard, text: `Pay GHS ${getFinalAmount().toFixed(2)} with Paystack` }
  }

  const handlePayment = async () => {
    if (selectedPlan === "enterprise") {
      toast.error("Please contact sales for Enterprise plan")
      return
    }

    if (billingPeriod === "trial") {
      toast.error("Please select a billing period to upgrade")
      return
    }

    // Allow payment if upgrading from trial or if billing period is selected or if there are changes
    if (!hasChanges() && billingPeriod === "1" && subscriptionPlan?.status !== "trial") {
      toast.error("No changes detected")
      return
    }

    setLoading(true)
    try {
      const finalAmount = getFinalAmount()
      const period = getSelectedPeriod()
      
      const { authorizationUrl, reference } = await initializePayment({
        amount: finalAmount,
        modules,
        plan: selectedPlan !== subscriptionPlan?.plan ? selectedPlan : undefined,
        billingPeriod: period.months,
      })

      const popup = window.open(authorizationUrl, "paystack", "width=600,height=700")
      
      const checkPayment = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(checkPayment)
          try {
            const verification = await verifyPayment(reference)
            if (verification.status === "success") {
              await updateSubscription(
                {
                  modules,
                  plan: selectedPlan !== subscriptionPlan?.plan ? selectedPlan : undefined,
                  billingPeriod: period.months,
                  amount: finalAmount,
                  paymentReference: reference,
                },
                pathname
              )
              setOriginalModules(modules)
              setSubscriptionPlan({ ...subscriptionPlan, plan: selectedPlan })
              toast.success("Subscription updated successfully")
              await loadSubscription()
            } else {
              toast.error("Payment failed or was cancelled")
            }
          } catch (error: any) {
            toast.error("Payment verification failed", { description: error.message })
          } finally {
            setLoading(false)
          }
        }
      }, 1000)
    } catch (error: any) {
      toast.error("Payment initialization failed", { description: error.message })
      setLoading(false)
    }
  }

  const getChangedModules = () => {
    const changed: string[] = []
    Object.keys(modules).forEach((key) => {
      if (modules[key] !== originalModules[key]) {
        const module = MODULES.find((m) => m.key === key)
        if (module) {
          changed.push(`${module.name} (${modules[key] ? "+" : "-"}GHS ${module.price})`)
        }
      }
    })
    return changed
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            {subscriptionPlan?.status === "trial" ? (
              <span className="flex items-center gap-2">
                Currently on trial period
                <Badge variant="outline">Trial</Badge>
              </span>
            ) : (
              "Choose your plan and manage modules"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <Card
                key={plan.key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.key
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => plan.key !== "enterprise" && setSelectedPlan(plan.key)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {selectedPlan === plan.key && <Crown className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-2xl font-bold">
                    {plan.price > 0 ? `GHS ${plan.price}` : "Custom"}
                    {plan.price > 0 && <span className="text-sm text-muted-foreground">/month</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  {plan.key === "enterprise" && (
                    <Badge variant="outline" className="w-full justify-center">Contact Sales</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add-on Modules</CardTitle>
          <CardDescription>Customize your subscription with additional features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasChanges() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Changes detected:</p>
                  <ul className="list-disc list-inside text-sm">
                    {getChangedModules().map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {MODULES.map((module) => (
              <Card key={module.key}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{module.name}</h4>
                      <Badge variant="secondary">GHS {module.price}/month</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <Switch
                    checked={modules[module.key] || false}
                    onCheckedChange={(checked) => handleModuleToggle(module.key, checked)}
                    disabled={loading}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Billing Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Plan ({PLANS.find(p => p.key === selectedPlan)?.name})</span>
                <span className="font-medium">GHS {getBasePlanPrice().toFixed(2)}/month</span>
              </div>
              
              {MODULES.filter(m => modules[m.key]).map(module => (
                <div key={module.key} className="flex justify-between">
                  <span className="text-muted-foreground">{module.name}</span>
                  <span className="font-medium">GHS {module.price.toFixed(2)}/month</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Monthly Total</span>
                <span>GHS {getMonthlyTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Billing Period</label>
                {subscriptionPlan?.status === "trial" && (
                  <Badge variant="secondary" className="text-xs">Current: Trial</Badge>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {BILLING_PERIODS.map(period => (
                  <Button
                    key={period.key}
                    variant={billingPeriod === period.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingPeriod(period.key)}
                    className="flex flex-col h-auto py-3"
                    disabled={period.isTrial && subscriptionPlan?.status !== "trial"}
                  >
                    <span className="font-semibold">{period.label}</span>
                    {period.discount > 0 && (
                      <Badge variant="secondary" className="mt-1 text-xs">Save {period.discount}%</Badge>
                    )}
                    {period.isTrial && billingPeriod === "trial" && (
                      <Badge variant="secondary" className="mt-1 text-xs">Current</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
              {billingPeriod === "trial" ? (
                <div className="text-center py-2">
                  <p className="text-muted-foreground">You are currently on trial</p>
                  <p className="text-xs text-muted-foreground mt-1">Select a billing period above to upgrade</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({getSelectedPeriod().months} month{getSelectedPeriod().months > 1 ? 's' : ''})</span>
                    <span>GHS {getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {getSelectedPeriod().discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({getSelectedPeriod().discount}%)</span>
                      <span>-GHS {getDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>GHS {getFinalAmount().toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <Button onClick={handlePayment} disabled={!canPay()} size="lg" className="w-full gap-2">
              {(() => {
                const { icon: Icon, text } = getPayButtonText()
                return (
                  <>
                    <Icon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {text}
                  </>
                )
              })()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
