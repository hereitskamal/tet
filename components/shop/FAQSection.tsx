'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Where are you located?',
    a: 'Our showrooms are located in London, Amsterdam, and Dubai. We ship globally to over 50 countries from our central warehouse.',
  },
  {
    q: 'How can I care for my furniture?',
    a: 'Most pieces require only a soft, dry cloth for regular cleaning. We include a care card with every order and offer a detailed guide on our website by material type.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery is 5–10 business days. White-glove delivery with installation is available in select cities within 2–4 weeks.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return window on most items. Custom and bespoke orders are non-refundable. Contact our team and we\'ll handle everything.',
  },
  {
    q: 'Do you offer custom sizes or finishes?',
    a: 'Yes — many of our pieces are available in custom dimensions and a range of material finishes. Reach out to our studio team to start a bespoke order.',
  },
]

function FAQItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-[#e2e2e2] last:border-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-black">{q}</span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-[#3b3d2b] text-[#e5e2e1]' : 'border border-black/20 text-black'}`}>
          {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#555555] leading-[1.85] pb-5 max-w-lg">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(1)

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
      <p className="text-[10px] tracking-[0.28em] uppercase text-[#777] mb-3 text-center">support</p>
      <h2 className="text-[clamp(1.6rem,3.5vw,4rem)] font-medium font-black lowercase tracking-tight text-center mb-14">
        frequently asked questions
      </h2>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left image */}
        <div className="hidden lg:block relative rounded-[1.75rem] overflow-hidden h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop"
            alt="Living room"
            fill
            className="object-cover"
            sizes="40vw"
          />
        </div>

        {/* Right accordion */}
        <div>
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              open={open === i}
              toggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
