import axios from "axios"

const STRIPE_BASE_URL = "https://api.stripe.com/v1"

export const stripeService = {
  async createPaymentIntent(secretKey: string, data: {
    amount: number // in cents
    currency: string
    customer?: string
    metadata?: any
  }) {
    const response = await axios.post(
      `${STRIPE_BASE_URL}/payment_intents`,
      new URLSearchParams(data as any),
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    return response.data
  },

  async retrievePaymentIntent(secretKey: string, paymentIntentId: string) {
    const response = await axios.get(
      `${STRIPE_BASE_URL}/payment_intents/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    )
    return response.data
  },

  async createCustomer(secretKey: string, data: {
    email: string
    name?: string
    phone?: string
    metadata?: any
  }) {
    const response = await axios.post(
      `${STRIPE_BASE_URL}/customers`,
      new URLSearchParams(data as any),
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    return response.data
  },

  async listCharges(secretKey: string, params?: {
    limit?: number
    customer?: string
  }) {
    const response = await axios.get(
      `${STRIPE_BASE_URL}/charges`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        params,
      }
    )
    return response.data
  },
}
