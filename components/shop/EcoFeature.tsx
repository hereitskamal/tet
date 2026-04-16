'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const slides = [
  {
    tag: 'Sustainable by Design',
    headline: 'Eco-Friendly Designs, Timeless Quality.',
    body: 'We use sustainably sourced materials and responsible production methods — because beautiful design should never come at the planet\'s expense.',
    href: '/about',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
    ],
  },
  {
    tag: 'Artisan Crafted',
    headline: 'Every Piece Tells a Story.',
    body: 'Our makers spend weeks on a single chair. Slow craftsmanship, enduring results — furniture that improves with age.',
    href: '/about',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop',
    ],
  },
]

export default function EcoFeature() {
  const [idx, setIdx] = useState(0)
  const slide = slides[idx]

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left — text */}
        <motion.div
          key={idx + '-text'}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#9a9c7a] mb-4">
            {slide.tag}
          </p>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-black lowercase tracking-tight leading-[1.05] mb-5 max-w-sm">
            {slide.headline}
          </h2>
          <p className="text-sm text-[#555555] leading-[1.85] mb-8 max-w-sm">
            {slide.body}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 text-sm text-black hover:text-[#555] transition-colors lowercase group mb-12"
          >
            learn more <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
              className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % slides.length)}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#3b3d2b] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-[#aaa] tracking-[0.1em] ml-1">
              {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Right — image collage */}
        <motion.div
          key={idx + '-images'}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid gap-3"
          style={{ gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: '220px 180px' }}
        >
          {/* Large image spans 2 rows */}
          <div className="row-span-2 relative rounded-[1.5rem] overflow-hidden">
            <Image
              src={slide.images[0]}
              alt=""
              fill
              className="object-cover"
              sizes="30vw"
            />
          </div>
          {/* Two smaller images */}
          <div className="relative rounded-[1.25rem] overflow-hidden">
            <Image
              src={slide.images[1]}
              alt=""
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
          <div className="relative rounded-[1.25rem] overflow-hidden">
            <Image
              src={slide.images[2]}
              alt=""
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
