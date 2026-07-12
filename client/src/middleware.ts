import { NextRequest, NextResponse } from 'next/server'

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/change-password',
  '/verify-email',
]

const PROTECTED_PREFIXES = [
  '/checkout',
  '/my-bookings',
  '/profile',
  '/admin',
]

function isSameOriginApi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  return apiUrl.startsWith('/')
}

export function middleware(req: NextRequest) {
  if (!isSameOriginApi()) {
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl

  const hasSession = Boolean(req.cookies.get('refreshToken'))

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/change-password',
    '/verify-email',
    '/checkout/:path*',
    '/my-bookings/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
}