'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '50+', label: 'Countries' },
  { value: '2M', label: 'Happy Homes' },
  { value: '12+', label: 'Years Crafting' },
  { value: '98%', label: 'Satisfaction' },
]

export default function AboutStats() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-24">
      <span className="inline-flex items-center text-[10px] tracking-[0.25em] uppercase border border-black/20 rounded-full px-4 py-1.5 mb-6 text-[#555]">
        About Us
      </span>
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left — headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >

          <h3 className="text-display font-black lowercase tracking-tight leading-[1.02] text-black mb-6 max-w-lg">
            we craft warmth, beauty, and meaningful spaces.
          </h3>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-black transition-colors lowercase group"
          >
            learn more <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Right — description + stat tiles */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-8 max-w-sm mt-5"
        >
          <p className="text-sm md:text-lg text-[#555555] leading-[1.85]">
            With a commitment to craftsmanship, sustainable materials, and a customer-first approach, we help you create spaces that feel beautiful from the very first piece.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-[#f4f4f4] rounded-2xl p-6 aspect-square flex flex-col items-start justify-end"
              >
                <p className="text-[2rem] tracking-tight leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase text-[#9a9c7a]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
