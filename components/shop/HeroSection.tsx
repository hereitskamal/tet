'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 min-h-[calc(100vh-6rem)] flex items-center">
        <div className="grid gap-16 lg:grid-cols-[1.1fr,0.9fr] items-center py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-10"
          >
            {/* Tag */}
            <motion.p
              variants={staggerItem}
              className="text-[10px] tracking-[0.4em] uppercase text-[#777777]"
            >
              Belo.Fur
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={staggerItem}
              className="text-[clamp(3.5rem,8vw,6.5rem)] font-black leading-[0.95] tracking-[-0.04em] max-w-3xl"
            >
              Calm furniture for rooms that feel effortless.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="max-w-2xl text-lg leading-[1.9] text-[#555555]"
            >
              Warm materials and sculptural lines designed to make every interior feel curated and quietly luxurious.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white uppercase tracking-[0.18em] hover:bg-[#222222] transition-colors group"
              >
                shop now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black hover:bg-[#f3f3f3] transition-colors"
              >
                explore collection
              </Link>
            </motion.div>
          </motion.div>

         
        </div>
      </div>
    </section>
  )
}
