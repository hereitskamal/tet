import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import Providers from '@/components/layout/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import GeoInit from '@/components/layout/GeoInit'
import type { CurrencyCode } from '@/store/currency'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Earthy Touch Co. — Objects of Quiet Intention',
    template: '%s | The Earthy Touch Co.',
  },
  description:
    'Premium furniture and home objects. Embracing earth in every touch.',
  keywords: ['furniture', 'home', 'design', 'minimal', 'premium'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read the currency code injected by proxy.ts into request headers.
  // Falls back to null → GeoInit will read the geo-currency cookie instead.
  const headersList = await headers()
  const geoCurrency = (headersList.get('x-geo-currency') as CurrencyCode | null) ?? null

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f9f9f9] text-[#1a1c1c] antialiased">
        <Providers>
          {/* Seeds Zustand currency store with geo-detected value before first render */}
          <GeoInit geoCurrency={geoCurrency} />
          <Navbar />
          <main className="flex-1 relative overflow-hidden mobile-app-shell">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
