"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PaymentFailed() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          Your payment could not be processed. Please try again.
        </p>
        <Button onClick={() => router.push("/sign-up")} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  )
}
