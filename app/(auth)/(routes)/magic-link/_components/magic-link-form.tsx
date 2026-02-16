"use client"

import { useAuth } from "@/providers/auth-provider"
import type React from "react"
import { useState } from "react"


interface MagicLinkFormProps {
    onSuccess?: () => void
    onError?: (error: string) => void
    className?: string
    redirectTo?: string
}

export function MagicLinkForm({ onSuccess, onError, className = "", redirectTo }: MagicLinkFormProps) {
    const { sendMagicLink } = useAuth()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await sendMagicLink(email)
            if (result.success) {
                setSent(true)
                onSuccess?.()
            } else {
                setError(result.error || "Failed to send magic link")
                onError?.(result.error || "Failed to send magic link")
            }
        } catch (error) {
            setError("Network error")
            onError?.("Network error")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className={`text-center space-y-6 ${className}`}>
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check your email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        We've sent a magic link to <strong className="text-cyan-600 dark:text-cyan-400">{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Click the link in your email to sign in instantly
                    </p>
                </div>
                <button 
                    onClick={() => {
                        setSent(false)
                        setError("")
                    }} 
                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
                >
                    Send another link
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                    }}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    required
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                We'll send you a secure link to sign in without a password
            </p>
        </form>
    )
}