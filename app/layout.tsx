import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f9f9f9] text-[#1a1c1c] antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 relative overflow-hidden mobile-app-shell">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
