import axios from "axios"

const PAYSTACK_BASE_URL = "https://api.paystack.co"

export const paystackService = {
  async initializeTransaction(secretKey: string, data: {
    email: string
    amount: number // in kobo (smallest currency unit)
    reference?: string
    callback_url?: string
    metadata?: any
  }) {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  },

  async verifyTransaction(secretKey: string, reference: string) {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    )
    return response.data
  },

  async listTransactions(secretKey: string, params?: {
    perPage?: number
    page?: number
    from?: string
    to?: string
  }) {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        params,
      }
    )
    return response.data
  },

  async createCustomer(secretKey: string, data: {
    email: string
    first_name?: string
    last_name?: string
    phone?: string
  }) {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/customer`,
      data,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  },

  async chargeAuthorization(secretKey: string, data: {
    email: string
    amount: number
    authorization_code: string
    reference?: string
  }) {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/charge_authorization`,
      data,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  },
}
