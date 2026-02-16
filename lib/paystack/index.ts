import axios from "axios"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE_URL = "https://api.paystack.co"

export async function initializePayment(email: string, amount: number, metadata: any) {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to pesewas
        currency: "GHS",
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    return { success: true, data: response.data.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Payment initialization failed" }
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    return { success: true, data: response.data.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Payment verification failed" }
  }
}
