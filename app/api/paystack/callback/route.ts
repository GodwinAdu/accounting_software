import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/actions/paystack.action";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  try {
    const result = await verifyPayment(reference, "/");

    if (result.success) {
      return NextResponse.redirect(
        new URL("/marketing/sms/credits?payment=success", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/marketing/sms/credits?payment=failed", request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL("/marketing/sms/credits?payment=error", request.url)
    );
  }
}
