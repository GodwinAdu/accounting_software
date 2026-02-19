import axios from "axios"

const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3"

export const flutterwaveService = {
  async initiatePayment(secretKey: string, data: {
    tx_ref: string
    amount: number
    currency: string
    redirect_url: string
    customer: {
      email: string
      name?: string
      phonenumber?: string
    }
    customizations?: {
      title?: string
      description?: string
      logo?: string
    }
  }) {
    const response = await axios.post(
      `${FLUTTERWAVE_BASE_URL}/payments`,
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

  async verifyTransaction(secretKey: string, transactionId: string) {
    const response = await axios.get(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    )
    return response.data
  },

  async listTransactions(secretKey: string, params?: {
    from?: string
    to?: string
    page?: number
  }) {
    const response = await axios.get(
      `${FLUTTERWAVE_BASE_URL}/transactions`,
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
