"use client"

import { useAuth } from "@/providers/auth-provider"
import type React from "react"
import { useState } from "react"

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await forgotPassword(email)
            if (result.success) {
                setSent(true)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm">
                    We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <button onClick={() => setSent(false)} className="text-sm">
                    Send another email
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-medium">Forgot Password</h3>
                <p className="mt-2 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
    )
}