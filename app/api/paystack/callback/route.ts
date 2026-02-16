import { NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/lib/paystack"
import { connectToDB } from "@/lib/connection/mongoose"
import Organization from "@/lib/models/organization.model"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.redirect(new URL("/payment/failed", request.url))
    }

    const verification = await verifyPayment(reference)

    if (!verification.success || verification.data.status !== "success") {
      return NextResponse.redirect(new URL("/payment/failed", request.url))
    }

    const { organizationId } = verification.data.metadata

    await connectToDB()

    await Organization.findByIdAndUpdate(organizationId, {
      "subscriptionPlan.status": "active",
      "subscriptionPlan.startDate": new Date(),
      "subscriptionPlan.expiryDate": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    return NextResponse.redirect(new URL("/payment/success", request.url))
  } catch (error) {
    console.error("Paystack callback error:", error)
    return NextResponse.redirect(new URL("/payment/failed", request.url))
  }
}
