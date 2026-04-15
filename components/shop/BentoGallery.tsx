'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Leaf, Droplets, Wind } from 'lucide-react'
import type { Product } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'

// ─── Animated counter ──────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 2200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!isInView) return
    let frame = 0
    const totalFrames = Math.round(duration / 16)
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick = () => {
      frame++
      setCount(Math.floor(ease(Math.min(frame / totalFrames, 1)) * target))
      if (frame < totalFrames) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return { count, ref }
}

// ─── Sustainability tile ────────────────────────────────────────────────────

function SustainabilityCounter() {
  const { count: trees, ref } = useAnimatedCounter(14283, 2200)
  const { count: liters } = useAnimatedCounter(2841, 2600)
  const { count: tons } = useAnimatedCounter(847, 2000)

  const stats = [
    { Icon: Leaf,    value: trees.toLocaleString(),          label: 'trees planted' },
    { Icon: Droplets,value: `${liters.toLocaleString()}k`,   label: 'litres water saved' },
    { Icon: Wind,    value: tons.toLocaleString(),           label: 'tons CO₂ offset' },
  ]

  return (
    <div
      ref={ref}
      className="h-full flex flex-col justify-between p-7 bg-[#3b3d2b] text-[#e5e2e1] rounded-[1.5rem]"
    >
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#9a9c7a] mb-3">impact report</p>
        <h3 className="text-xl font-black lowercase tracking-tight leading-tight">
          every purchase<br />plants a future.
        </h3>
      </div>
      <div className="space-y-4">
        {stats.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-[#9a9c7a] shrink-0" />
            <div>
              <p className="text-base font-black tracking-tight leading-none">{value}</p>
              <p className="text-[10px] text-[#9a9c7a] lowercase tracking-[0.08em] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Product tile ───────────────────────────────────────────────────────────

function ProductTile({ product, delay = 0, large = false }: { product: Product; delay?: number; large?: boolean }) {
  const { formatPrice } = useCurrency()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-full rounded-[1.5rem] overflow-hidden bg-[#e2e2e2] group"
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 80vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <Link href={`/products/${product.slug}`} className="absolute inset-0" data-cursor="view">
        <div className={`absolute text-white ${large ? 'bottom-7 left-7 right-7' : 'bottom-5 left-5 right-5'}`}>
          {large && <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 mb-1">featured</p>}
          <h3 className={`font-black lowercase tracking-tight leading-tight ${large ? 'text-xl mb-2' : 'text-sm'}`}>
            {product.name}
          </h3>
          <p className={`font-medium text-white/90 ${large ? 'text-sm' : 'text-xs mt-0.5'}`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Brand video tile ───────────────────────────────────────────────────────

function BrandVideoTile() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggle = () => {
    if (!videoRef.current) return
    playing ? videoRef.current.pause() : videoRef.current.play().catch(() => {})
    setPlaying((p) => !p)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-full rounded-[1.5rem] overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        poster="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop"
        loop
        muted
        playsInline
        onEnded={() => setPlaying(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/50">brand story</p>
        <div>
          <h3 className="font-black lowercase tracking-tight text-2xl leading-tight mb-5">
            craft without<br />compromise.
          </h3>
          <button onClick={toggle} className="flex items-center gap-2.5 group/btn">
            <span className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center group-hover/btn:bg-white/15 transition-colors">
              {playing
                ? <Pause className="w-3.5 h-3.5" />
                : <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
              }
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover/btn:text-white transition-colors">
              {playing ? 'pause film' : 'watch film'}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Quote tile ─────────────────────────────────────────────────────────────

function QuoteTile({ delay = 0.25 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full rounded-[1.5rem] bg-black text-[#e5e2e1] flex flex-col justify-center p-8"
    >
      <p className="text-[9px] tracking-[0.3em] uppercase text-[#777777] mb-5">philosophy</p>
      <p className="text-lg font-black lowercase tracking-tight leading-snug">
        &ldquo;quiet luxury is not about showing wealth — it&rsquo;s about knowing it.&rdquo;
      </p>
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function BentoGallery({ products }: { products: Product[] }) {
  const [p1, p2, p3] = products

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.24em] uppercase text-[#777777] mb-2">the brand universe</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black lowercase tracking-tight leading-[0.95]">
          objects. stories. impact.
        </h2>
      </div>

      {/* ── Desktop bento grid (lg+): 3 cols × 2 rows ── */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4" style={{ gridTemplateRows: '320px 320px' }}>
        {/* Col 1, rows 1–2: large product */}
        <div className="row-span-2">
          {p1 ? <ProductTile product={p1} delay={0} large /> : <QuoteTile delay={0} />}
        </div>
        {/* Col 2, row 1: brand video */}
        <BrandVideoTile />
        {/* Col 3, row 1: sustainability */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full"
        >
          <SustainabilityCounter />
        </motion.div>
        {/* Col 2, row 2: product 2 */}
        <div>
          {p2 ? <ProductTile product={p2} delay={0.15} /> : <QuoteTile delay={0.15} />}
        </div>
        {/* Col 3, row 2: product 3 or quote */}
        <div>
          {p3 ? <ProductTile product={p3} delay={0.25} /> : <QuoteTile />}
        </div>
      </div>

      {/* ── Mobile / tablet grid (< lg): 2-col masonry-style ── */}
      <div className="grid grid-cols-2 gap-3 lg:hidden" style={{ gridAutoRows: '260px' }}>
        {/* Row 1: brand video (full width) */}
        <div className="col-span-2">
          <BrandVideoTile />
        </div>
        {/* Row 2: product 1 + sustainability */}
        {p1 && <ProductTile product={p1} delay={0} large />}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full"
        >
          <SustainabilityCounter />
        </motion.div>
        {/* Row 3: product 2 + 3 */}
        {p2 && <ProductTile product={p2} delay={0.1} />}
        {p3 ? <ProductTile product={p3} delay={0.2} /> : <QuoteTile delay={0.2} />}
      </div>
    </section>
  )
}
