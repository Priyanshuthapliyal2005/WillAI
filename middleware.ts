import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // If user is authenticated and trying to access landing page, redirect to dashboard
    if (token && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes without authentication
        if (pathname === '/' || pathname.startsWith('/auth/')) {
          return true
        }

        // Require authentication for dashboard routes
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        // Default to allowing access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
  ],
}
