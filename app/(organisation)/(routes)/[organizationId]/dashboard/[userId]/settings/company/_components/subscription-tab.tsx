"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, CreditCard, Calendar, Users, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function SubscriptionTab() {
  const [loading, setLoading] = useState(true)
  const [org, setOrg] = useState<any>(null)

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const data = await fetchOrganizationUserById()
      setOrg(data)
    } catch (error) {
      toast.error("Failed to load subscription")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  const subscription = org?.subscriptionPlan
  const isActive = subscription?.status === "active"
  const isTrial = subscription?.status === "trial"
  const isExpired = subscription?.status === "expired"

  const daysRemaining = subscription?.expiryDate 
    ? Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>Your current plan and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-2xl font-bold capitalize">{subscription?.plan || "Starter"}</p>
            </div>
            <Badge variant={isActive ? "default" : isTrial ? "secondary" : "destructive"} className="text-sm">
              {subscription?.status || "Trial"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </p>
              <p className="font-medium">
                {subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expiry Date
              </p>
              <p className="font-medium">
                {subscription?.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {(isTrial || isActive) && daysRemaining > 0 && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {daysRemaining} days remaining
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                {isTrial ? "Your trial will expire soon. Upgrade to continue using all features." : "Your subscription will renew automatically."}
              </p>
            </div>
          )}

          {isExpired && (
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Subscription Expired
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Please renew your subscription to continue using the platform.
              </p>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Limit
            </p>
            <p className="font-medium">
              {subscription?.currentEmployees || 0} / {subscription?.employeeLimit || 10} employees
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Modules</CardTitle>
          <CardDescription>Modules included in your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {org?.modules && Object.entries(org.modules).map(([key, value]: [string, any]) => (
              value && (
                <div key={key} className="flex items-center gap-2 p-2 rounded-lg border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm capitalize">{key}</span>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {(isTrial || isExpired) && (
          <Button>Upgrade Plan</Button>
        )}
        {isActive && (
          <Button variant="outline">Manage Subscription</Button>
        )}
      </div>
    </div>
  )
}
