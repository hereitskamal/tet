'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    tag: 'seating',
    label: 'chairs',
    headline: 'Objects that bear weight with grace.',
    href: '/products?category=chairs',
    src: '/chair.jpg',
    portrait: true,   // ← tall card
  },
  {
    tag: 'dining',
    label: 'tables',
    headline: 'Surfaces made for living.',
    href: '/products?category=tables',
    src: '/table.jpg',
    portrait: false,
  },
  {
    tag: 'sleep',
    label: 'beds',
    headline: 'Rest, redefined.',
    href: '/products?category=beds',
    src: '/bed.jpg',
    portrait: false,
  },
  {
    tag: 'storage',
    label: 'wardrobes',
    headline: 'Space that breathes.',
    href: '/products?category=wardrobes',
    src: '/wardrob.jpg',
    portrait: false,
  },
  {
    tag: 'lighting',
    label: 'lamps',
    headline: 'Light as architecture.',
    href: '/products?category=lighting',
    src: '/lamp.jpg',
    portrait: false,
  },
]

function CollectionCard({
  item,
  className = '',
  imageHeight = 'h-full',
  delay = 0,
}: {
  item: typeof collections[0]
  className?: string
  imageHeight?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative overflow-hidden rounded-[1.5rem] ${className}`}
      data-cursor="view"
    >
      {/* Image */}
      <div className={`relative w-full ${imageHeight} overflow-hidden`}>
        <Image
          src={item.src}
          alt={item.label}
          fill
          quality={90}
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle bottom scrim for label legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Label strip — sits below the image, transparent bg */}
      <div className="pt-4 pb-1 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#777777] mb-1">{item.tag}</p>
          <h3 className="text-base font-black lowercase tracking-tight leading-tight">{item.label}</h3>
        </div>
        <Link
          href={item.href}
          className="shrink-0 flex items-center gap-1.5 text-xs lowercase text-[#777777] hover:text-black transition-colors group/link"
        >
          explore
          <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function CollectionsGrid() {
  const [chair, table, bed, wardrobe, lamp] = collections

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#777777] mb-2">
            collections
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-black lowercase tracking-tight leading-[0.95]">
            five ways to furnish a life.
          </h2>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm lowercase text-[#777777] hover:text-black transition-colors"
        >
          all collections <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/*
        Desktop layout (lg+):
          ┌─────────────┬──────────┬──────────┐
          │             │  table   │   lamp   │
          │    chair    ├──────────┼──────────┤
          │  (portrait) │   bed    │ wardrobe │
          └─────────────┴──────────┴──────────┘

        3 columns. Chair spans 2 rows (portrait).
        Each landscape card has a fixed height.
      */}

      {/* ── Desktop grid ── */}
      <div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '300px 300px',
        }}
      >
        {/* Chair — portrait, row-span-2 */}
        <div className="row-span-2">
          <CollectionCard
            item={chair}
            className="h-full"
            imageHeight="h-[560px]"
            delay={0}
          />
        </div>

        {/* Table — landscape top-middle */}
        <CollectionCard item={table} className="h-full" imageHeight="h-[220px]" delay={0.1} />

        {/* Lamp — landscape top-right */}
        <CollectionCard item={lamp} className="h-full" imageHeight="h-[220px]" delay={0.15} />

        {/* Bed — landscape bottom-middle */}
        <CollectionCard item={bed} className="h-full" imageHeight="h-[220px]" delay={0.2} />

        {/* Wardrobe — landscape bottom-right */}
        <CollectionCard item={wardrobe} className="h-full" imageHeight="h-[220px]" delay={0.25} />
      </div>

      {/* ── Mobile / tablet grid (2-col) ── */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {/* Chair full-width on mobile */}
        <CollectionCard item={chair} className="col-span-2" imageHeight="h-[280px]" delay={0} />
        <CollectionCard item={table} imageHeight="h-[200px]" delay={0.05} />
        <CollectionCard item={lamp}  imageHeight="h-[200px]" delay={0.1} />
        <CollectionCard item={bed}   imageHeight="h-[200px]" delay={0.15} />
        <CollectionCard item={wardrobe} imageHeight="h-[200px]" delay={0.2} />
      </div>
    </section>
  )
}
