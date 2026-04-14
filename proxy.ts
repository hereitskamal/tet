export { auth as proxy } from '@/lib/auth'

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/account/:path*'],
}
