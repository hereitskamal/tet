'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center bg-white">

      {/* ── Background image — desktop only ───────────────────────── */}
      <div className="hidden md:block absolute w-full h-full md:max-w-[400px] md:max-h-[300px] lg:max-w-[500px] lg:max-h-[400px] 2xl:max-w-[600px] 2xl:max-h-[460px] top-1/2 transform -translate-y-1/3 right-1/4 translate-x-1/2">
        <Image
          src="/heroImage2.png"
          alt=""
          fill
          priority
          quality={100}
          className="object-cover object-center"
        // sizes="100vw"
        />
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-6 py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-8"
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
            className="text-[clamp(3.5rem,8vw,4.8rem)] font-bold sm:font-[700] leading-[0.95] tracking-[-0.04em] max-w-xl"
          >
            Calm <span className="text-stone-400">furniture</span> for rooms that feel effortless.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="max-w-md text-sm md:text-lg leading-[1.9] text-[#555555]"
          >
            Warm materials and sculptural lines designed to make every interior
            feel curated and quietly luxurious.
          </motion.p>
          <div className="block md:hidden w-full h-[200px] relative">
            <Image
              src="/heroImage2.png"
              alt=""
              fill
              priority
              quality={100}
              className="object-cover object-center"
            />
          </div>
          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-xs md:text-sm font-semibold text-white uppercase tracking-[0.18em] hover:bg-[#222222] transition-colors group"
            >
              shop now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black px-8 py-4 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-black hover:bg-[#f3f3f3] transition-colors"
            >
              explore collection
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
