"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import type { AuthState, LoginCredentials, RegisterData } from "./types"
import { loginUser, verifyEmailCode, resendVerificationEmail as resendVerificationEmailAction, resendVerificationEmailForRegistration, sendMagicLink as sendMagicLinkAction, verifyMagicLink as verifyMagicLinkAction, sendPhoneCode, verifyPhoneCode, verifyMFACode, checkTrustedDevice } from "@/lib/actions/user.action"
import { registerOrganization } from "@/lib/actions/organization.action"

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials | { phone: string; code?: string }) => Promise<{ success: boolean; requiresMfa?: boolean; requiresMfaSetup?: boolean; phoneCodeSent?: boolean; error?: string; mfaToken?: string; user?: any; userId?: string; email?: string; message?: string }>
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string }>
    logout: () => Promise<void>
    refreshToken: () => Promise<boolean>
    sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>
    verifyMagicLink: (token: string) => Promise<{ success: boolean; error?: string }>
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
    resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
    verifyEmail: (code: string, email?: string) => Promise<{ success: boolean; error?: string }>
    verifyPhone: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>
    sendPhoneVerification: (phone: string) => Promise<{ success: boolean; error?: string }>
    verifyTwoFactor: (code: string, backupCode?: string, rememberDevice?: boolean) => Promise<{ success: boolean; error?: string }>
    changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
    resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        loading: true,
    })
    const [mfaToken, setMfaToken] = useState<string | null>(null)

    const cookieName = "auth-token"
    const refreshTokenName = "refresh-token"

    const getToken = (): string | null => {
        if (typeof document === "undefined") return null
        const cookies = document.cookie.split(";")
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${cookieName}=`))
        return tokenCookie ? tokenCookie.split("=")[1] : null
    }

    const setToken = (token: string, refreshToken?: string, trustedDeviceToken?: string): void => {
        if (typeof document === "undefined") return

        document.cookie = `${cookieName}=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`

        if (refreshToken) {
            document.cookie = `${refreshTokenName}=${refreshToken}; path=/; secure; samesite=strict; max-age=${30 * 24 * 60 * 60}`
        }
        
        if (trustedDeviceToken) {
            document.cookie = `trusted-device=${trustedDeviceToken}; path=/; secure; samesite=strict; max-age=${30 * 24 * 60 * 60}`
        }
    }

    const removeTokens = (): void => {
        if (typeof document === "undefined") return

        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${refreshTokenName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    const login = async (credentials: LoginCredentials | { phone: string; code?: string }) => {
        try {
            // Handle phone login
            if ('phone' in credentials) {
                if (credentials.code) {
                    // Verify phone code
                    const data = await verifyPhoneCode(credentials.phone, credentials.code)
                    
                    if (data.success && data.accessToken) {
                        setToken(data.accessToken, data.refreshToken)
                        const decoded = jwtDecode<any>(data.accessToken)
                        setState({
                            user: {
                                id: decoded.sub,
                                email: decoded.email,
                                name: decoded.name,
                                roles: decoded.roles,
                                emailVerified: decoded.emailVerified || false,
                                phoneVerified: decoded.phoneVerified || false,
                                mfaEnabled: decoded.mfaEnabled || false
                            },
                            isAuthenticated: true,
                            loading: false,
                        })
                        return { success: true }
                    }
                    return { success: false, error: data.error || 'Invalid code' }
                } else {
                    // Send SMS code
                    const data = await sendPhoneCode(credentials.phone)
                    return { success: false, phoneCodeSent: data.success, error: data.error }
                }
            }
            
            // Handle email login
            const data = await loginUser(credentials as LoginCredentials)
            console.log("loging",data)
            
            if (!data.success) {
                return { success: false, error: data.error || "Invalid credentials" }
            }

            if (data.requiresMFASetup) {
                return { 
                    success: true, 
                    requiresMfaSetup: true, 
                    userId: data.userId, 
                    email: data.email,
                    message: data.message 
                }
            }

            if (data.requiresMFA) {
                // Check for trusted device first
                const trustedDeviceToken = document.cookie
                    .split(';')
                    .find(cookie => cookie.trim().startsWith('trusted-device='))
                    ?.split('=')[1];
                
                if (trustedDeviceToken && data.userId) {
                    const trustedCheck = await checkTrustedDevice(data.userId, trustedDeviceToken);
                    if (trustedCheck.success) {
                        // Skip MFA, continue with login
                        const continueResult = await loginUser({ ...credentials as LoginCredentials, mfaToken: data.mfaToken });
                        if (continueResult.success && continueResult.accessToken) {
                            setToken(continueResult.accessToken, continueResult.refreshToken);
                            const decoded = jwtDecode<any>(continueResult.accessToken);
                            setState({
                                user: {
                                    id: decoded.sub,
                                    email: decoded.email,
                                    name: decoded.name,
                                    roles: decoded.roles,
                                    emailVerified: decoded.emailVerified || false,
                                    phoneVerified: decoded.phoneVerified || false,
                                    mfaEnabled: decoded.mfaEnabled || false
                                },
                                isAuthenticated: true,
                                loading: false,
                            });
                            return { success: true };
                        }
                    }
                }
                
                setMfaToken(data.mfaToken)
                return { success: false, requiresMfa: true, mfaToken: data.mfaToken }
            }

            if (!data.accessToken || !data.refreshToken) {
                return { success: false, error: "Authentication failed - no tokens received" }
            }

            setToken(data.accessToken, data.refreshToken)

            const decoded = jwtDecode<any>(data.accessToken)
            setState({
                user: {
                    id: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                    roles: decoded.roles,
                    emailVerified: decoded.emailVerified || false,
                    phoneVerified: decoded.phoneVerified || false,
                    mfaEnabled: decoded.mfaEnabled || false
                },
                isAuthenticated: true,
                loading: false,
            })

            return { success: true, user: data.user }
        } catch (error) {
            return { success: false, error: "Unexpected error" }
        }
    }

    const register = async (data: RegisterData) => {
        try {
            const result = await registerOrganization(data as any)
            return result
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            removeTokens()
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
            })
            window.location.href = '/sign-in';
        }
    }

    const refreshToken = async (): Promise<boolean> => {
        try {
            const cookies = document.cookie.split(";")
            const refreshCookie = cookies.find((cookie) => cookie.trim().startsWith(`${refreshTokenName}=`))
            const refreshTokenValue = refreshCookie ? refreshCookie.split("=")[1] : null

            if (!refreshTokenValue) return false

            const response = await fetch(`/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refreshTokenValue }),
            })

            if (!response.ok) return false

            const data = await response.json()
            setToken(data.accessToken, data.refreshToken)

            const decoded = jwtDecode<any>(data.accessToken)
            setState({
                user: {
                    id: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                    roles: decoded.roles,
                    emailVerified: decoded.emailVerified || false,
                    phoneVerified: decoded.phoneVerified || false,
                    mfaEnabled: decoded.mfaEnabled || false
                },
                isAuthenticated: true,
                loading: false,
            })

            return true
        } catch (error) {
            return false
        }
    }

    const sendMagicLink = async (email: string) => {
        try {
            const result = await sendMagicLinkAction(email)
            return result
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const verifyMagicLink = async (token: string) => {
        try {
            const result = await verifyMagicLinkAction(token)
            
            if (result.success && result.accessToken && result.refreshToken) {
                setToken(result.accessToken, result.refreshToken)

                const decoded = jwtDecode<any>(result.accessToken)
                setState({
                    user: {
                        id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        roles: decoded.roles,
                        emailVerified: decoded.emailVerified || false,
                        phoneVerified: decoded.phoneVerified || false,
                        mfaEnabled: decoded.mfaEnabled || false
                    },
                    isAuthenticated: true,
                    loading: false,
                })
            }

            return result
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const forgotPassword = async (email: string) => {
        try {
            const response = await fetch(`/auth/forgot-password`, {
                method: "POST",
                body: JSON.stringify({ email }),
            })

            const data = await response.json()
            return { success: response.ok, error: response.ok ? undefined : data.message }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const resetPassword = async (token: string, newPassword: string) => {
        try {
            const response = await fetch(`/auth/reset-password`, {
                method: "POST",
                body: JSON.stringify({ token, newPassword }),
            })

            const data = await response.json()
            return { success: response.ok, error: response.ok ? undefined : data.message }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const verifyEmail = async (code: string, email?: string) => {
        try {
            const result = await verifyEmailCode(code, email)
            return result
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await resendVerificationEmailAction()
            return result
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }
    
    const sendPhoneVerification = async (phone: string) => {
        try {
            const response = await fetch(`/phone/send-verification`, {
                method: "POST",
                body: JSON.stringify({ phone }),
            })

            const data = await response.json()
            return { success: response.ok, error: response.ok ? undefined : data.message }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const verifyPhone = async (phone: string, code: string) => {
        try {
            const response = await fetch(`/phone/verify`, {
                method: "POST",
                body: JSON.stringify({ phone, code }),
            })

            const data = await response.json()
            return { success: response.ok, error: response.ok ? undefined : data.message }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const verifyTwoFactor = async (code: string, backupCode?: string, rememberDevice?: boolean) => {
        try {
            const result = await verifyMFACode(code, backupCode, mfaToken || undefined, rememberDevice)
            
            if (result.success && result.accessToken) {
                setToken(result.accessToken, result.refreshToken, result.trustedDeviceToken)
                setMfaToken(null) // Clear MFA token after successful verification

                const decoded = jwtDecode<any>(result.accessToken)
                setState({
                    user: {
                        id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        roles: decoded.roles,
                        emailVerified: decoded.emailVerified || false,
                        phoneVerified: decoded.phoneVerified || false,
                        mfaEnabled: decoded.mfaEnabled || false
                    },
                    isAuthenticated: true,
                    loading: false,
                })
            }

            return { success: result.success, error: result.error }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const response = await fetch(`/auth/change-password`, {
                method: "POST",
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await response.json()
            return { success: response.ok, error: response.ok ? undefined : data.message }
        } catch (error) {
            return { success: false, error: "Network error" }
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            const token = getToken()

            if (!token) {
                setState((prev: AuthState) => ({ ...prev, loading: false }))
                return
            }

            try {
                const decoded = jwtDecode<any>(token)

                console.log("decoded", decoded)

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    const refreshed = await refreshToken()
                    if (!refreshed) {
                        removeTokens()
                        setState({ user: null, isAuthenticated: false, loading: false })
                    }
                    return
                }

                setState({
                    user: {
                        id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        roles: decoded.roles,
                        emailVerified: decoded.emailVerified || false,
                        phoneVerified: decoded.phoneVerified || false,
                        mfaEnabled: decoded.mfaEnabled || false
                    },
                    isAuthenticated: true,
                    loading: false,
                })

                // Auto-refresh token 2 minutes before expiry
                const timeUntilExpiry = decoded.exp * 1000 - Date.now()
                const refreshTime = timeUntilExpiry - 2 * 60 * 1000 // 2 minutes before expiry
                
                if (refreshTime > 0) {
                    setTimeout(async () => {
                        await refreshToken()
                    }, refreshTime)
                }
            } catch (error) {
                removeTokens()
                setState({ user: null, isAuthenticated: false, loading: false })
            }
        }

        initAuth()
    }, [])

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        refreshToken,
        sendMagicLink,
        verifyMagicLink,
        forgotPassword,
        resetPassword,
        verifyEmail,
        verifyPhone,
        sendPhoneVerification,
        verifyTwoFactor,
        changePassword,
        resendVerificationEmail,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}