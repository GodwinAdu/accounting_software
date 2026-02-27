import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify, SignJWT } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing environment variable: JWT_ACCESS_SECRET");
}

if (!REFRESH_TOKEN_SECRET) {
    throw new Error("Missing environment variable: JWT_REFRESH_SECRET");
}

const accessTokenEncoder = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
const refreshTokenEncoder = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security configuration
const SECURITY_CONFIG = {
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 100,
        authMaxRequests: 5, // Stricter for auth endpoints
    },
    blockedPaths: [
        '/admin',
        '/.env',
        '/config',
        '/backup',
        '/wp-admin',
        '/phpmyadmin'
    ],
    suspiciousPatterns: [
        /\.\.\//,  // Only block path traversal with slashes
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /union.*select/i,
        /drop.*table/i,
        /^\/\.env$/ // Only block exact .env file access
    ]
}


interface JWTPayload {
    exp: number
    user?: {
        roles: string[]
    }
}

// function getRateLimitKey(request: NextRequest): string {
//     const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
//     return `${ip}:${request.nextUrl.pathname}`
// }

// function checkRateLimit(key: string, maxRequests: number): boolean {
//     const now = Date.now()
//     const record = rateLimitStore.get(key)

//     if (!record || now > record.resetTime) {
//         rateLimitStore.set(key, { count: 1, resetTime: now + SECURITY_CONFIG.rateLimit.windowMs })
//         return true
//     }

//     if (record.count >= maxRequests) {
//         return false
//     }

//     record.count++
//     return true
// }

// function detectSuspiciousActivity(request: NextRequest): boolean {
//     const url = request.nextUrl.pathname + request.nextUrl.search
//     const userAgent = request.headers.get('user-agent') || ''

//     // Check for blocked paths
//     if (SECURITY_CONFIG.blockedPaths.some(path => url.includes(path))) {
//         return true
//     }

//     // Check for suspicious patterns
//     if (SECURITY_CONFIG.suspiciousPatterns.some(pattern => pattern.test(url))) {
//         return true
//     }

//     // Check for suspicious user agents
//     const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan']
//     if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
//         return true
//     }

//     return false
// }

// function logSecurityEvent(request: NextRequest, event: string, details?: any) {
//     const timestamp = new Date().toISOString()
//     const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
//     const userAgent = request.headers.get('user-agent') || 'unknown'

//     console.log(`[SECURITY] ${timestamp} - ${event}`, {
//         ip,
//         path: request.nextUrl.pathname,
//         userAgent,
//         ...details
//     })
// }

const authConfig = {
    publicRoutes: [
        "/",
        "/magic-link",
        "/sign-in", "/sign-up",
        "/forgot-password",
        "/reset-password",
        "/two-factor",
        "/verify-email",
        "verify-phone",
        "/features",
        "/solutions",
        "/pricing",
        "/testimonials",
        "/integrations",
        "/faq",
        "/documentation",
        "/documentation/*",
        "/api-reference",
        "/support",
        "/blog",
        "/about",
        "/careers",
        "/contact",
        "/privacy",
        "/terms",
        "/magic-link-login",
        "/payment-callback",
        "/sms-payment-callback",
        "/api/*",
        "/setup-2fa",
        "/shared/*",
        "/terms"
    ],
    protectedRoutes: [] as string[],
    loginUrl: "/sign-in",
    afterAuthUrl: "/dashboard",
    cookieName: "auth-token",
    requireRoles: [] as string[],
}


// Function to verify JWT and extract payload
async function verifyToken(token: string, secretEncoder: Uint8Array): Promise<Record<string, unknown> | null> {
    try {
        const { payload } = await jwtVerify(token, secretEncoder);
        return payload as Record<string, unknown>;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}

// Function to create a new access token
async function createNewAccessToken(payload: Record<string, unknown>): Promise<string> {
    // Remove exp from the payload to avoid conflicts
    const payloadWithoutExp = { ...payload };
    delete (payloadWithoutExp as Record<string, unknown>)['exp'];

    // Create a new access token with a 1-hour expiration
    return new SignJWT(payloadWithoutExp)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(accessTokenEncoder);
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip security checks for static assets and Next.js internals
    if (pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        return NextResponse.next()
    }

    // Only apply security checks in production
    // if (process.env.NODE_ENV === 'production') {
    //     // Detect suspicious activity
    //     if (detectSuspiciousActivity(request)) {
    //         logSecurityEvent(request, 'SUSPICIOUS_ACTIVITY_BLOCKED')
    //         return new NextResponse('Access Denied', { status: 403 })
    //     }

    //     // Rate limiting
    //     // const rateLimitKey = getRateLimitKey(request)
    //     const isAuthRoute = pathname.includes('/auth') ||
    //         pathname.includes('/sign-in') ||
    //         pathname.includes('/sign-up')

    //     const maxRequests = isAuthRoute ?
    //         SECURITY_CONFIG.rateLimit.authMaxRequests :
    //         SECURITY_CONFIG.rateLimit.maxRequests

    //     if (!checkRateLimit(rateLimitKey, maxRequests)) {
    //         logSecurityEvent(request, 'RATE_LIMIT_EXCEEDED', { maxRequests })
    //         return new NextResponse('Too Many Requests', { status: 429 })
    //     }
    // }

    // Check if route is public
    const isPublicRoute = authConfig.publicRoutes.some((route: string) => {
        if (route.endsWith("*")) {
            return pathname.startsWith(route.slice(0, -1))
        }
        return pathname === route || pathname.startsWith(route + "/")
    })

    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Get tokens
    const accessToken = request.cookies.get('auth-token')?.value
    const refreshToken = request.cookies.get('refresh-token')?.value

    // No access token, try refresh token
    if (!accessToken) {
        if (!refreshToken) {
            const loginUrl = new URL(authConfig.loginUrl, request.url)
            loginUrl.searchParams.set("redirect", pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Verify refresh token
        const refreshPayload = await verifyToken(refreshToken, refreshTokenEncoder)
        if (!refreshPayload || (typeof refreshPayload.exp === 'number' && refreshPayload.exp < Math.floor(Date.now() / 1000))) {
            const loginUrl = new URL(authConfig.loginUrl, request.url)
            loginUrl.searchParams.set("redirect", pathname)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete('auth-token')
            response.cookies.delete('refresh-token')
            return response
        }

        // Create new access token
        const newAccessToken = await createNewAccessToken(refreshPayload)
        const response = NextResponse.next()
        response.cookies.set({
            name: 'auth-token',
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
            sameSite: 'strict'
        })
        return response
    }

    // Verify access token
    const payload = await verifyToken(accessToken, accessTokenEncoder)

    // Access token invalid/expired, try refresh token
    if (!payload || (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000))) {
        if (!refreshToken) {
            const loginUrl = new URL(authConfig.loginUrl, request.url)
            loginUrl.searchParams.set("redirect", pathname)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete('auth-token')
            return response
        }

        // Verify refresh token
        const refreshPayload = await verifyToken(refreshToken, refreshTokenEncoder)
        if (!refreshPayload || (typeof refreshPayload.exp === 'number' && refreshPayload.exp < Math.floor(Date.now() / 1000))) {
            const loginUrl = new URL(authConfig.loginUrl, request.url)
            loginUrl.searchParams.set("redirect", pathname)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete('auth-token')
            response.cookies.delete('refresh-token')
            return response
        }

        // Create new access token
        const newAccessToken = await createNewAccessToken(refreshPayload)
        const response = NextResponse.next()
        response.cookies.set({
            name: 'auth-token',
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
            sameSite: 'strict'
        })
        return response
    }

    // Token valid, check if about to expire (within 5 minutes)
    const tokenExpiresIn = typeof payload.exp === 'number' ? payload.exp * 1000 - Date.now() : 0
    const isAboutToExpire = tokenExpiresIn > 0 && tokenExpiresIn < 5 * 60 * 1000

    if (isAboutToExpire && refreshToken) {
        const refreshPayload = await verifyToken(refreshToken, refreshTokenEncoder)
        if (refreshPayload && (typeof refreshPayload.exp !== 'number' || refreshPayload.exp >= Math.floor(Date.now() / 1000))) {
            const newAccessToken = await createNewAccessToken(refreshPayload)
            const response = NextResponse.next()
            response.cookies.set({
                name: 'auth-token',
                value: newAccessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/',
                sameSite: 'strict'
            })
            return response
        }
    }

    return NextResponse.next()
}




export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}