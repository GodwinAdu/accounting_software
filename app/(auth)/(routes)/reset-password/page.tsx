"use client"

import { useAuth } from "@/providers/auth-provider"
import type React from "react"
import { useState } from "react"

export default function ResetPasswordPage() {
    const { resetPassword } = useAuth()
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            return
        }

        if (formData.password.length < 8) {
            return
        }

        setLoading(true)

        try {
            const token = new URLSearchParams(window.location.search).get('token') || ''
            await resetPassword(token, formData.password)
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-medium">Reset Password</h3>
                <p className="mt-2 text-sm">Enter your new password below.</p>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium">
                    New Password
                </label>
                <div className="mt-1 relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter new password"
                        className="block w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    )
}