'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Layers, Menu, ShoppingBag, User, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Logo from './Logo'
import CurrencySelector from '@/components/ui/CurrencySelector'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/collections', label: 'collections' },
  { href: '/products', label: 'shop' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { count, openCart } = useCartStore()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const cartCount = count()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className={`px-6 py-4 transition-all duration-300 ${
            scrolled ? 'glass shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-[0.05em] lowercase transition-colors ${
                    pathname === link.href
                      ? 'text-black font-medium'
                      : 'text-[#777777] hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <CurrencySelector />

              {session?.user ? (
                <Link
                  href={session.user.role === 'ADMIN' ? '/admin' : '/account'}
                  className="hidden md:flex items-center gap-1.5 text-sm text-[#777777] hover:text-black transition-colors tracking-[0.05em] lowercase"
                >
                  <User className="w-4 h-4" />
                  {session.user.role === 'ADMIN' ? 'admin' : session.user.name?.split(' ')[0] || 'account'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-sm text-[#777777] hover:text-black transition-colors tracking-[0.05em] lowercase"
                >
                  sign in
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative p-2 text-black hover:text-[#777777] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-black"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-8 pt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl font-black lowercase tracking-tight text-black"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {session?.user ? (
                  <Link
                    href="/account"
                    className="text-2xl font-medium lowercase text-[#777777]"
                  >
                    account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-2xl font-medium lowercase text-[#777777]"
                  >
                    sign in
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!mobileOpen && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
          <div className="mx-4 mb-4 rounded-full bg-white/95 backdrop-blur-xl border border-[#e2e2e2] shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-4 py-2">
            <Link href="/" className="flex flex-col items-center gap-1 text-[#777777] hover:text-black transition-colors">
              <Home className="w-5 h-5" />
              <span className="text-[10px] lowercase">home</span>
            </Link>
            <Link href="/collections" className="flex flex-col items-center gap-1 text-[#777777] hover:text-black transition-colors">
              <Layers className="w-5 h-5" />
              <span className="text-[10px] lowercase">collections</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center gap-1 text-[#777777] hover:text-black transition-colors">
              <span className="w-5 h-5 grid place-items-center text-black">•</span>
              <span className="text-[10px] lowercase">shop</span>
            </Link>
            <button
              onClick={openCart}
              className="relative flex flex-col items-center gap-1 text-[#777777] hover:text-black transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-0 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-black px-1.5 text-[10px] text-white font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="text-[10px] lowercase">cart</span>
            </button>
            <Link
              href={session?.user ? (session.user.role === 'ADMIN' ? '/admin' : '/account') : '/login'}
              className="flex flex-col items-center gap-1 text-[#777777] hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] lowercase">
                {session?.user ? 'account' : 'sign in'}
              </span>
            </Link>
          </div>
        </nav>
      )}
    </>
  )
}
