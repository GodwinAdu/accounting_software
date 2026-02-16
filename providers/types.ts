export interface User {
    id: string
    email: string
    name: string
    roles: string[]
    emailVerified: boolean
    phoneVerified: boolean
    mfaEnabled: boolean
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
}

export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

export interface RegisterData {
    name: string
    email: string
    phone: string
    taxId?: string
    address: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    fullName: string
    password: string
    plan: "starter" | "professional" | "enterprise"
    modules: {
        dashboard: boolean
        banking: boolean
        sales: boolean
        expenses: boolean
        payroll: boolean
        accounting: boolean
        tax: boolean
        products: boolean
        reports: boolean
        settings: boolean
    }
}
