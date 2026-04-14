export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Collections' }

const collectionConfig = [
  {
    slug: 'living-room-furniture',
    headline: 'living room.',
    sub: 'soft volume collection',
    desc: 'Furniture designed for relaxed living rooms with quiet luxury and sculptural comfort.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200',
    span: 'lg:col-span-2',
  },
  {
    slug: 'bedroom-furniture',
    headline: 'bedroom.',
    sub: 'the restful series',
    desc: 'Beds and nightstands crafted to make bedrooms feel calm, warm, and layered.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    span: '',
  },
  {
    slug: 'dining-room-furniture',
    headline: 'dining room.',
    sub: 'table talk collection',
    desc: 'Tables and seating made to encourage longer meals and better conversations.',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
    span: '',
  },
  {
    slug: 'office-furniture',
    headline: 'office.',
    sub: 'studio essentials',
    desc: 'Work furniture built for focus, comfort, and a thoughtful home office aesthetic.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    span: 'lg:col-span-2',
  },
]

async function getCategoryCounts() {
  const counts = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
  return Object.fromEntries(counts.map((c: { slug: string; _count: { products: number } }) => [c.slug, c._count.products]))
}

export default async function CollectionsPage() {
  const counts = await getCategoryCounts()

  return (
    <div className="pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <AnimatedSection className="mb-16">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-4">
            ss 2025
          </p>
          <h1 className="text-display lowercase">collections.</h1>
          <p className="text-sm text-[#777777] mt-4 max-w-sm leading-relaxed">
            we believe in objects that command attention through their quietness.
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {collectionConfig.map((col, i) => (
            <AnimatedSection
              key={col.slug}
              delay={i * 0.08}
              className={col.span}
            >
              <Link
                href={`/products?category=${col.slug}`}
                className="group relative block overflow-hidden bg-[#e2e2e2] rounded-sm"
              >
                <div className="aspect-[4/5]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${col.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                    {col.sub} · {counts[col.slug] ?? 0} objects
                  </p>
                  <h2 className="text-heading-xl lowercase tracking-tight text-white leading-tight mb-3">
                    {col.headline}
                  </h2>
                  <p className="text-sm text-white/60 max-w-xs leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {col.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition-colors lowercase">
                    explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* Manifesto */}
        <AnimatedSection className="py-24 border-t border-[#e2e2e2] mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <h2 className="text-heading-md lowercase tracking-tight">
              designed spaces.
            </h2>
            <div>
              <p className="text-sm text-[#777777] leading-relaxed mb-4">
                Each collection emerges from a singular question: what is the minimum necessary to achieve the maximum effect? We strip away until only intention remains.
              </p>
              <p className="text-sm text-[#777777] leading-relaxed">
                The result is furniture that does not compete with the life lived around it, but instead creates the conditions for that life to flourish.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
