'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useCurrency } from '@/hooks/useCurrency'

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
            className="fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#f9f9f9] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#e2e2e2]">
              <h2 className="font-black lowercase tracking-tight text-xl">
                cart ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#e2e2e2] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-start justify-center h-full gap-4 py-16"
                  >
                    <p className="text-4xl font-black lowercase tracking-tight text-[#e2e2e2]">empty.</p>
                    <p className="text-sm text-[#777777]">your cart is waiting to be filled.</p>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="text-sm font-medium lowercase underline underline-offset-4 hover:no-underline transition-all"
                    >
                      browse objects →
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-[#e2e2e2] rounded-lg overflow-hidden flex-shrink-0">
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
                          <p className="font-bold lowercase tracking-tight text-sm leading-tight truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-[#777777] mt-1">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-xs text-[#777777] hover:text-black transition-colors lowercase"
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
              <div className="px-6 py-6 border-t border-[#e2e2e2]">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-sm text-[#777777] lowercase tracking-[0.05em]">total</span>
                  <span className="font-black text-2xl tracking-tight">{formatPrice(cartTotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors"
                >
                  checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-[#777777] mt-4 hover:text-black transition-colors lowercase"
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
