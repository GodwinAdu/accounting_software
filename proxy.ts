import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

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
        "/shared/*"
    ],
    protectedRoutes: [] as string[],
    loginUrl: "/sign-in",
    afterAuthUrl: "/dashboard",
    cookieName: "auth-token",
    requireRoles: [] as string[],
}
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(authConfig.cookieName)?.value

    // Create response with security headers
    const response = NextResponse.next()
   

    // Skip security checks for static assets and Next.js internals
    if (pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        return response
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

    // ✅ Make all API routes public (no auth check)
    if (pathname.startsWith("/api")) {
        return NextResponse.next()
    }

    // ✅ Allow chat route prefix
    if (pathname.startsWith("/chat")) {
        return NextResponse.next();
    }

    // Check if route is public
    const isPublicRoute = authConfig.publicRoutes.some((route: string) => {
        if (route.endsWith("*")) {
            return pathname.startsWith(route.slice(0, -1))
        }
        return pathname === route || pathname.startsWith(route + "/")
    })

    // Check if route is protected
    const isProtectedRoute =
        authConfig.protectedRoutes.length > 0
            ? authConfig.protectedRoutes.some((route: string) => {
                if (route.endsWith("*")) {
                    return pathname.startsWith(route.slice(0, -1))
                }
                return pathname === route || pathname.startsWith(route + "/")
            })
            : !isPublicRoute



    // If accessing public route and authenticated, redirect to dashboard
    if (isPublicRoute && token && (pathname === authConfig.loginUrl || pathname === "/sign-up")) {
        try {
            const decoded = jwtDecode<JWTPayload>(token)
            if (decoded.exp * 1000 > Date.now()) {
                return NextResponse.redirect(new URL(authConfig.afterAuthUrl, request.url))
            }
        } catch (error) {
            // Invalid token, continue to public route
        }
    }

    // If accessing protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        // logSecurityEvent(request, 'UNAUTHORIZED_ACCESS_ATTEMPT')
        const loginUrlWithRedirect = new URL(authConfig.loginUrl, request.url)
        loginUrlWithRedirect.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrlWithRedirect)
    }

    // If token exists, verify it
    if (token && isProtectedRoute) {
        try {
            const decoded = jwtDecode<JWTPayload>(token)

            // Check if token is expired or expiring soon (within 1 minute)
            const expiresAt = decoded.exp * 1000
            const now = Date.now()
            const oneMinute = 60 * 1000

            if (expiresAt <= now) {
                // Token expired - check if refresh token exists
                const refreshToken = request.cookies.get('refresh-token')?.value
                
                if (refreshToken) {
                    // Let the client-side auth provider handle refresh
                    return response
                }
                
                // No refresh token, redirect to login
                const loginUrlWithRedirect = new URL(authConfig.loginUrl, request.url)
                loginUrlWithRedirect.searchParams.set("redirect", pathname)
                const redirectResponse = NextResponse.redirect(loginUrlWithRedirect)
                redirectResponse.cookies.delete(authConfig.cookieName)
                redirectResponse.cookies.delete('refresh-token')
                return redirectResponse
            }

            // Check roles if required
            if (authConfig.requireRoles.length > 0) {
                const userRoles = decoded.user?.roles || []
                const hasRequiredRole = authConfig.requireRoles.some((role) => userRoles.includes(role))

                if (!hasRequiredRole) {
                    // logSecurityEvent(request, 'INSUFFICIENT_PERMISSIONS', { userRoles, requiredRoles: authConfig.requireRoles })
                    return NextResponse.redirect(new URL("/unauthorized", request.url))
                }
            }

            // logSecurityEvent(request, 'AUTHENTICATED_ACCESS')
        } catch (error) {
            // Invalid token, redirect to login
            // logSecurityEvent(request, 'INVALID_TOKEN_ACCESS')
            const loginUrlWithRedirect = new URL(authConfig.loginUrl, request.url)
            loginUrlWithRedirect.searchParams.set("redirect", pathname)
            const response = NextResponse.redirect(loginUrlWithRedirect)
            response.cookies.delete(authConfig.cookieName)
            return response
        }
    }

    return response
}




export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}