'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ArrowRight, ShoppingBag, Truck, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useCurrency } from '@/hooks/useCurrency'

// ─── Thresholds ─────────────────────────────────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 150   // USD
const REWARDS_TIER_1 = 200            // spend $200 → unlock "free gift"
const REWARDS_TIER_2 = 500            // spend $500 → unlock "10% off next order"

// ─── Progress Bar ───────────────────────────────────────────────────────────
function ProgressBar({
  value,
  max,
  color = 'bg-black',
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

// ─── Rewards panel ──────────────────────────────────────────────────────────
function RewardsBanner({ total }: { total: number }) {
  const { formatPrice } = useCurrency()

  const shippingDiff = FREE_SHIPPING_THRESHOLD - total
  const rewardsDiff  = total < REWARDS_TIER_1
    ? REWARDS_TIER_1 - total
    : total < REWARDS_TIER_2
      ? REWARDS_TIER_2 - total
      : 0

  const nextRewardLabel = total >= REWARDS_TIER_2
    ? null
    : total >= REWARDS_TIER_1
      ? '10% off your next order'
      : 'a free gift'

  return (
    <div className="mx-4 mb-3 rounded-2xl p-4 space-y-4 bg-white/10 border border-white/15 backdrop-blur-sm">
      {/* Free shipping progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Truck className="w-3.5 h-3.5" />
            <span className="lowercase tracking-[0.04em]">
              {shippingDiff > 0
                ? <>spend <span className="text-white font-semibold">{formatPrice(shippingDiff)}</span> more for free shipping</>
                : <span className="text-emerald-400 font-semibold">free shipping unlocked ✓</span>
              }
            </span>
          </div>
        </div>
        <ProgressBar
          value={total}
          max={FREE_SHIPPING_THRESHOLD}
          color={total >= FREE_SHIPPING_THRESHOLD ? 'bg-emerald-400' : 'bg-white'}
        />
      </div>

      {/* Rewards progress */}
      {nextRewardLabel && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Gift className="w-3.5 h-3.5" />
              <span className="lowercase tracking-[0.04em]">
                {rewardsDiff > 0
                  ? <>{formatPrice(rewardsDiff)} away from <span className="text-white font-semibold">{nextRewardLabel}</span></>
                  : <span className="text-amber-400 font-semibold">{nextRewardLabel} unlocked ✓</span>
                }
              </span>
            </div>
          </div>
          <ProgressBar
            value={total < REWARDS_TIER_1 ? total : total - REWARDS_TIER_1}
            max={total < REWARDS_TIER_1 ? REWARDS_TIER_1 : REWARDS_TIER_2 - REWARDS_TIER_1}
            color="bg-amber-400"
          />
        </div>
      )}
    </div>
  )
}

// ─── Main drawer ─────────────────────────────────────────────────────────────
export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const { formatPrice } = useCurrency()
  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Glassmorphic drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col overflow-hidden"
            style={{
              background: 'rgba(15, 15, 15, 0.82)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white/60" />
                <h2 className="font-black lowercase tracking-tight text-lg text-white">
                  cart
                  {items.length > 0 && (
                    <span className="ml-1.5 text-sm font-normal text-white/40">({items.length})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rewards / progress */}
            {items.length > 0 && (
              <div className="pt-3">
                <RewardsBanner total={cartTotal} />
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-start justify-center h-full gap-4 py-16"
                  >
                    <p className="text-4xl font-black lowercase tracking-tight text-white/10">empty.</p>
                    <p className="text-sm text-white/40">your cart is waiting to be filled.</p>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="text-sm font-medium lowercase text-white/60 underline underline-offset-4 hover:text-white transition-colors"
                    >
                      browse objects →
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold lowercase tracking-tight text-sm leading-tight truncate text-white">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-white/50 mt-0.5">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors text-white/60 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-5 text-center text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors text-white/60 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-xs text-white/30 hover:text-white/70 transition-colors lowercase"
                            >
                              remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-white/8">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-sm text-white/40 lowercase tracking-[0.05em]">subtotal</span>
                  <span className="font-black text-2xl tracking-tight text-white">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-white/90 transition-colors"
                >
                  checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-white/30 mt-4 hover:text-white/60 transition-colors lowercase"
                >
                  continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
