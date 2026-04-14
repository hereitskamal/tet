'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Lock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

type Step = 'address' | 'payment' | 'confirm'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()
  const cartTotal = total()
  const [step, setStep] = useState<Step>('address')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const handlePlaceOrder = async () => {
    if (!session?.user) {
      router.push('/login?redirect=/checkout')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0],
          })),
          total: cartTotal,
          address,
        }),
      })
      const order = await res.json()
      setOrderId(order.id)
      clearCart()
      setStep('confirm')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'confirm' && orderId) {
    return (
      <div className="pt-28 pb-24 min-h-screen flex items-center justify-center px-6">
        <AnimatedSection className="text-center max-w-md">
          <motion.div
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-heading-xl lowercase tracking-tight mb-4">order placed.</h1>
          <p className="text-sm text-[#777777] mb-2">order #{orderId.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-[#777777] leading-relaxed mb-10">
            your objects will begin their journey to you within 4–6 weeks. you will receive a confirmation by email.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-[#e5e2e1] px-8 py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors"
          >
            continue shopping
          </Link>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-16">
        <AnimatedSection className="mb-12">
          <h1 className="text-display lowercase tracking-tight">checkout.</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex items-center gap-4 mb-10">
              {(['address', 'payment'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? 'bg-black text-white' : 'bg-[#e2e2e2] text-[#777777]'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm lowercase ${step === s ? 'text-black font-medium' : 'text-[#777777]'}`}>
                    {s}
                  </span>
                  {i < 1 && <div className="w-8 h-px bg-[#e2e2e2]" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-heading-md lowercase tracking-tight mb-8">delivery address</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">
                        address line 1
                      </label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        placeholder="123 main street"
                        className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors placeholder:text-[#c6c6c6]"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">
                        address line 2
                      </label>
                      <input
                        type="text"
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        placeholder="apt, suite, etc. (optional)"
                        className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors placeholder:text-[#c6c6c6]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">city</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">state</label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">zip code</label>
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">country</label>
                        <select
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm lowercase outline-none transition-colors"
                        >
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IT">Italy</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!address.line1 || !address.city || !address.zip}
                    className="mt-10 w-full bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    continue to payment
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-heading-md lowercase tracking-tight mb-8">payment</h2>

                  <div className="bg-[#f3f3f4] rounded-sm p-6 mb-6 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-[#777777]" />
                    <p className="text-xs text-[#777777] lowercase">
                      this is a demo. no real payment is processed.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">
                        card number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        defaultValue="4242 4242 4242 4242"
                        readOnly
                        className="w-full bg-transparent border-b border-[#c6c6c6] pb-2 text-sm outline-none text-[#777777]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">expiry</label>
                        <input
                          type="text"
                          placeholder="12 / 26"
                          defaultValue="12 / 26"
                          readOnly
                          className="w-full bg-transparent border-b border-[#c6c6c6] pb-2 text-sm outline-none text-[#777777]"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">cvc</label>
                        <input
                          type="text"
                          placeholder="123"
                          defaultValue="123"
                          readOnly
                          className="w-full bg-transparent border-b border-[#c6c6c6] pb-2 text-sm outline-none text-[#777777]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button
                      onClick={() => setStep('address')}
                      className="flex-1 border border-black text-black py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-black hover:text-[#e5e2e1] transition-colors"
                    >
                      back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
                    >
                      {loading ? 'placing order...' : `place order · ${formatPrice(cartTotal)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <AnimatedSection direction="left" className="lg:sticky lg:top-28 self-start">
            <div className="bg-[#f3f3f4] p-6 rounded-sm">
              <h2 className="text-heading-md lowercase tracking-tight mb-6">order summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-[#e2e2e2] rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium lowercase truncate">{item.product.name}</p>
                      <p className="text-xs text-[#777777]">× {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e2e2e2] pt-4 flex justify-between">
                <span className="text-sm text-[#777777]">total</span>
                <span className="font-black">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
