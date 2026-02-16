"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SubscriptionExpired() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Expired</h1>
        <p className="text-gray-600 mb-8">
          Your subscription has expired. Please renew to continue using PayFlow.
        </p>
        <Button onClick={() => router.push("/pricing")} className="w-full">
          Renew Subscription
        </Button>
      </div>
    </div>
  )
}
