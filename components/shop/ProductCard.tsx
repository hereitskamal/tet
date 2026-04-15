'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ShoppingBag, Check, Play } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { useCurrency } from '@/hooks/useCurrency'

interface ProductCardProps {
  product: Product & { videoUrl?: string }
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { formatPrice } = useCurrency()
  const [added, setAdded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Simulate video URL - in production, this would come from your database
  const hasVideo = product.videoUrl || Math.random() > 0.5 // Random for demo

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (videoRef.current && hasVideo) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        // Fallback if video fails to play
        setIsHovering(false)
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (videoRef.current && hasVideo) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/products/${product.slug}`} className="group block" data-cursor="view">
        {/* Image/Video container */}
        <div
          className="relative overflow-hidden bg-[#e2e2e2] rounded-sm mb-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="aspect-[3/4]">
            {/* Image (visible by default) */}
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: isHovering && hasVideo ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>

            {/* Video overlay (hover state) */}
            {hasVideo && (
              <motion.video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={false}
                loop
                muted
                onLoadedData={() => setVideoLoaded(true)}
                animate={{
                  opacity: isHovering ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Simulated video URL - replace with actual video source */}
                <source src={product.videoUrl || '/videos/product-demo.mp4'} type="video/mp4" />
              </motion.video>
            )}

            {/* Play indicator when hovering over video */}
            <AnimatePresence>
              {isHovering && hasVideo && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-12 h-12 text-white fill-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tags */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.featured && (
              <span className="bg-black text-[#e5e2e1] text-[10px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full">
                featured
              </span>
            )}
            {product.compareAt && (
              <span className="bg-[#e5e2e1] text-black text-[10px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full">
                sale
              </span>
            )}
          </div>

          {/* Add to cart hover overlay */}
          <motion.button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 flex items-center gap-2 bg-black text-[#e5e2e1] px-4 py-2.5 rounded-full text-xs tracking-[0.05em] lowercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileTap={{ scale: 0.95 }}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                add to cart
              </>
            )}
          </motion.button>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-bold lowercase tracking-tight text-base leading-tight">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-medium text-sm">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-[#777777] line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <p className="text-xs text-[#777777] mt-0.5 lowercase">
            {product.category?.name}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
