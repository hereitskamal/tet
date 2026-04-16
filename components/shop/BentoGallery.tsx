'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, Droplets, Wind, Play, Pause } from 'lucide-react'
import type { Product } from '@/types'

// ─── Counter ────────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView) return
    let f = 0
    const frames = Math.round(duration / 16)
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const run = () => {
      f++
      setVal(Math.floor(ease(Math.min(f / frames, 1)) * target))
      if (f < frames) requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
  }, [inView, target, duration])
  return { val, ref }
}

// ─── Impact stat row ──────────────────────────────────────────────────────────
function StatRow({ icon: Icon, target, suffix, label, delay }: {
  icon: React.ElementType
  target: number
  suffix?: string
  label: string
  delay: number
}) {
  const { val, ref } = useCounter(target, 2000)
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5 text-[#9a9c7a]" />
        <span className="text-[11px] text-[#9a9c7a] tracking-[0.1em] uppercase font-normal">{label}</span>
      </div>
      <span ref={ref} className="text-base font-semibold tracking-tight text-[#e5e2e1] tabular-nums">
        {val.toLocaleString()}{suffix}
      </span>
    </motion.div>
  )
}

// ─── Brand video ──────────────────────────────────────────────────────────────
function BrandVideo() {
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const toggle = () => {
    if (!ref.current) return
    playing ? ref.current.pause() : ref.current.play().catch(() => {})
    setPlaying(p => !p)
  }
  return (
    <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] bg-[#111]">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        poster="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop"
        loop muted playsInline
        onEnded={() => setPlaying(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-2">brand story</p>
        <h3 className="text-lg font-black text-white lowercase tracking-tight leading-tight mb-4">
          craft without<br />compromise.
        </h3>
        <button onClick={toggle}
          className="self-start flex items-center gap-2 border border-white/30 text-white rounded-full px-4 py-2 text-[10px] tracking-[0.15em] uppercase hover:bg-white/10 transition-colors"
        >
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" fill="currentColor" />}
          {playing ? 'pause' : 'watch film'}
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BentoGallery({ products }: { products: Product[] }) {
  const [p1, p2, p3] = products

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#777] mb-2">brand universe</p>
          <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-black lowercase tracking-tight leading-[0.95]">
            objects. stories. impact.
          </h2>
        </div>
        <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm text-[#777] hover:text-black transition-colors lowercase">
          explore all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/*
        Layout:
        ┌──────────────────┬────────┬────────┐
        │                  │ video  │ stat   │
        │   hero product   ├────────┴────────┤
        │                  │  p2   │   p3   │
        └──────────────────┴────────┴────────┘
      */}

      {/* Desktop */}
      <div className="hidden lg:grid gap-3" style={{
        gridTemplateColumns: '1.1fr 0.6fr 0.6fr',
        gridTemplateRows: '280px 280px',
      }}>

        {/* Hero product — spans 2 rows */}
        <motion.div
          className="row-span-2 relative rounded-[1.75rem] overflow-hidden bg-[#efefef] group"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {p1 && <>
            <Image
              src={p1.images[0]}
              alt={p1.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="44vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <Link href={`/products/${p1.slug}`} data-cursor="view" className="absolute inset-0">
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="text-[9px] tracking-[0.2em] uppercase text-white/50 mb-1">featured</p>
                <h3 className="text-xl font-black lowercase tracking-tight leading-tight mb-3">{p1.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] border border-white/40 rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors">
                  shop now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </>}
        </motion.div>

        {/* Brand video */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <BrandVideo />
        </motion.div>

        {/* Sustainability */}
        <motion.div
          className="h-full rounded-[1.5rem] bg-[#3b3d2b] p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div>
            <p className="text-[9px] tracking-[0.28em] uppercase text-[#9a9c7a] mb-2">our impact</p>
            <p className="text-sm font-black text-[#e5e2e1] lowercase tracking-tight leading-tight">
              every purchase<br />plants a future.
            </p>
          </div>
          <div className="flex flex-col">
            <StatRow icon={Leaf}     target={14283} suffix="+" label="trees planted"    delay={0.3} />
            <StatRow icon={Droplets} target={2841}  suffix="k" label="litres saved"     delay={0.38} />
            <StatRow icon={Wind}     target={847}   suffix=""  label="tons CO₂ offset"  delay={0.46} />
          </div>
        </motion.div>

        {/* Product 2 */}
        <div className="h-full">
          {p2 ? (
            <motion.div
              className="h-full relative rounded-[1.5rem] overflow-hidden bg-[#efefef] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image src={p2.images[0]} alt={p2.name} fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="24vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Link href={`/products/${p2.slug}`} data-cursor="view" className="absolute inset-0">
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-bold lowercase tracking-tight truncate">{p2.name}</p>
                </div>
              </Link>
            </motion.div>
          ) : null}
        </div>

        {/* Product 3 */}
        <div className="h-full">
          {p3 ? (
            <motion.div
              className="h-full relative rounded-[1.5rem] overflow-hidden bg-[#efefef] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image src={p3.images[0]} alt={p3.name} fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="24vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Link href={`/products/${p3.slug}`} data-cursor="view" className="absolute inset-0">
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-bold lowercase tracking-tight truncate">{p3.name}</p>
                </div>
              </Link>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 lg:hidden">
        {p1 && (
          <div className="relative rounded-[1.75rem] overflow-hidden bg-[#efefef] aspect-[4/3] group">
            <Image src={p1.images[0]} alt={p1.name} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <Link href={`/products/${p1.slug}`} data-cursor="view" className="absolute inset-0">
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-lg font-black lowercase tracking-tight mb-2">{p1.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] border border-white/40 rounded-full px-4 py-2">
                  shop now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-[1.25rem] overflow-hidden">
            <BrandVideo />
          </div>
          {p2 && (
            <div className="relative aspect-square rounded-[1.25rem] overflow-hidden bg-[#efefef] group">
              <Image src={p2.images[0]} alt={p2.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <Link href={`/products/${p2.slug}`} className="absolute bottom-4 left-4">
                <p className="text-xs font-bold text-white lowercase truncate">{p2.name}</p>
              </Link>
            </div>
          )}
        </div>
        <div className="rounded-[1.5rem] bg-[#3b3d2b] p-6">
          <p className="text-[9px] tracking-[0.28em] uppercase text-[#9a9c7a] mb-3">our impact</p>
          <div className="flex flex-col">
            <StatRow icon={Leaf}     target={14283} suffix="+" label="trees planted"   delay={0} />
            <StatRow icon={Droplets} target={2841}  suffix="k" label="litres saved"    delay={0.08} />
            <StatRow icon={Wind}     target={847}   suffix=""  label="tons CO₂ offset" delay={0.16} />
          </div>
        </div>
      </div>
    </section>
  )
}
