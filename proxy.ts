import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { countryToCurrency } from '@/lib/geo'

const GEO_COOKIE = 'geo-currency'
const GEO_HEADER = 'x-geo-currency'

/**
 * Combined proxy: geo-personalisation on every request + auth guards on
 * protected routes.
 *
 * Uses next-auth v5's auth(handler) HOC so that req.auth carries the
 * verified session without a second round-trip.
 */
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl
  const session = (request as typeof request & { auth: unknown }).auth as
    | { user?: { role?: string } }
    | null

  // ── Auth guards ────────────────────────────────────────────────────────
  if ((pathname.startsWith('/account') || pathname.startsWith('/checkout')) && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ── Geo detection ───────────────────────────────────────────────────────
  // Vercel sets x-vercel-ip-country; Cloudflare sets cf-ipcountry.
  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    request.headers.get('x-country') ??
    null

  const currency = countryToCurrency(country)

  // Forward currency to server components via a request header.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(GEO_HEADER, currency)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Set a short-lived cookie so GeoInit can read it client-side as a fallback.
  response.cookies.set(GEO_COOKIE, currency, {
    path: '/',
    maxAge: 60 * 60, // 1 hour — re-detect on next session
    sameSite: 'lax',
    httpOnly: false, // must be JS-readable for GeoInit
  })

  return response
})

export const config = {
  matcher: [
    /*
     * Run on all routes except Next.js internals and static assets.
     * Auth token validation happens lazily inside next-auth — skipping static
     * files keeps cold-start latency low.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
  ],
}
