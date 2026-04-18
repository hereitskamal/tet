'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const items = [
  { label: 'chairs',    tag: 'seating',  src: '/chair.png',   href: '/products?category=chairs' },
  { label: 'tables',    tag: 'dining',   src: '/table.png',   href: '/products?category=tables' },
  { label: 'beds',      tag: 'sleep',    src: '/bed.png',     href: '/products?category=beds' },
  { label: 'wardrobes', tag: 'storage',  src: '/wardrob.png', href: '/products?category=wardrobes' },
  { label: 'lamps',     tag: 'lighting', src: '/lamp.png',    href: '/products?category=lighting' },
]

const scaleTransition = { type: 'spring' as const, stiffness: 260, damping: 22 }

export default function CollectionsShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-24 bg-white mt-10 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between -mb-10">
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#777777] mb-3">
            exclusive collections
          </p>
          <h2 className="text-display max-w-3xl leading-[0.95]">
            Curated pieces for modern homes.
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm lowercase text-[#777777] hover:text-black transition-colors shrink-0"
        >
          all products <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/*
        Desktop (lg+): 5 columns, all equal width
        Chair + bed slightly taller (portrait feel), rest standard
        Images are transparent PNGs — no card bg, blends with page
      */}
      <div className="hidden lg:flex gap-6 items-end">
        {items.map((item, i) => {
          const tall = i === 0 || i === 2
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 group"
            >
              <Link href={item.href} className="block" data-cursor="view">
                <motion.div
                  className={`relative w-full ${tall ? 'h-[340px]' : 'h-[260px]'} mb-5`}
                  whileHover={{ scale: 1.15, y: -4 }}
                  transition={scaleTransition}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    quality={95}
                    className="object-contain object-bottom"
                    sizes="20vw"
                  />
                </motion.div>

                {/* Label */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaaaaa] mb-1">
                      {item.tag}
                    </p>
                    <p className="text-lg font-medium font-black lowercase tracking-tight">
                      {item.label}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#aaaaaa] transition-all duration-300 group-hover:text-black group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Mobile / tablet: 2-col grid, chair full-width on top */}
      <div className="flex flex-col gap-8 lg:hidden">
        {/* Row 1: chair full width */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group"
        >
          <Link href={items[0].href} className="block" data-cursor="view">
            <motion.div
              className="relative w-full h-[240px] mb-4"
              whileHover={{ scale: 1.04 }}
              transition={scaleTransition}
            >
              <Image src={items[0].src} alt={items[0].label} fill quality={95}
                className="object-contain object-bottom"
                sizes="90vw" />
            </motion.div>
            <div className="h-px bg-[#e2e2e2] mb-3" />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaaaaa] mb-1">{items[0].tag}</p>
                <h3 className="text-base font-black lowercase tracking-tight">{items[0].label}</h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#aaaaaa]" />
            </div>
          </Link>
        </motion.div>

        {/* Row 2–3: 2-col */}
        <div className="grid grid-cols-2 gap-6">
          {items.slice(1).map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group"
            >
              <Link href={item.href} className="block" data-cursor="view">
                <motion.div
                  className="relative w-full h-[180px] mb-4"
                  whileHover={{ scale: 1.04 }}
                  transition={scaleTransition}
                >
                  <Image src={item.src} alt={item.label} fill quality={95}
                    className="object-contain object-bottom"
                    sizes="45vw" />
                </motion.div>
                <div className="h-px bg-[#e2e2e2] mb-3" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaaaaa] mb-1">{item.tag}</p>
                    <h3 className="text-sm font-black lowercase tracking-tight">{item.label}</h3>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#aaaaaa]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
