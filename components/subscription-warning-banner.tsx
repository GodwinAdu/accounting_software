"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, XCircle, Clock, X } from "lucide-react"
import Link from "next/link"
import { getSubscriptionWarning } from "@/lib/helpers/subscription-checker"
import { cn } from "@/lib/utils"

export function SubscriptionWarningBanner({ organizationId, userId }: { organizationId: string; userId: string }) {
  const [warning, setWarning] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    loadWarning()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadWarning = async () => {
    const data = await getSubscriptionWarning(organizationId)
    setWarning(data)
  }

  if (!warning || dismissed) return null

  const getStyles = () => {
    switch (warning.type) {
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-900",
          icon: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 text-white",
        }
      case "error":
        return {
          bg: "bg-orange-50 border-orange-200",
          text: "text-orange-900",
          icon: "text-orange-600",
          button: "bg-orange-600 hover:bg-orange-700 text-white",
        }
      case "critical":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-900",
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 text-white",
        }
      default:
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-900",
          icon: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 text-white",
        }
    }
  }

  const getIcon = () => {
    switch (warning.type) {
      case "warning":
        return Clock
      case "error":
        return AlertTriangle
      case "critical":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const styles = getStyles()
  const Icon = getIcon()

  return (
    <div className={cn("rounded-lg border-2 p-4", styles.bg)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", styles.icon)} />
          <div className="flex-1">
            <p className={cn("font-semibold text-sm", styles.text)}>
              {warning.message}
            </p>
            {warning.daysLeft && (
              <p className={cn("text-xs mt-1 opacity-80", styles.text)}>
                {warning.daysLeft} day{warning.daysLeft > 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/${organizationId}/dashboard/${userId}/settings/company?tab=subscription`}>
            <Button size="sm" className={styles.button}>
              Renew Subscription
            </Button>
          </Link>
          {warning.type === "warning" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className={cn("h-8 w-8 p-0", styles.text)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
