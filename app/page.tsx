export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/shop/HeroSection'
import ProductGrid from '@/components/shop/ProductGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  })
  return products as unknown as Product[]
}

const editorialSections = [
  {
    tag: 'living room',
    headline: 'objects that bear weight with grace.',
    body: 'Every chair is an argument about the human body. Ours argue for the poetry of support — that sitting well is a form of being well.',
    href: '/products?category=living-room-furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
    align: 'left',
  },
  {
    tag: 'lighting',
    headline: 'light as architecture.',
    body: "We don't add light to a room. We define it. Our lighting objects sculpt space through the precise direction of photons.",
    href: '/products?category=lighting',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    align: 'right',
  },
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#777777] mb-3">
              exclusive collections
            </p>
            <h2 className="text-display max-w-3xl leading-[0.95]">
              Curated pieces for modern homes.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm lowercase text-[#777777] hover:text-black transition-colors"
          >
            all products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts.slice(0, 3)} />
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {editorialSections.map((section) => (
            <div key={section.tag} className="group overflow-hidden rounded-[2rem] bg-[#f3f3f4]">
              <div
                className="relative h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${section.image})` }}
              />
              <div className="p-10">
                <p className="text-[10px] tracking-[0.24em] uppercase text-[#777777] mb-6">
                  {section.tag}
                </p>
                <h3 className="text-heading-lg lowercase tracking-tight mb-5 leading-[1.05]">
                  {section.headline}
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed mb-8 max-w-xl">
                  {section.body}
                </p>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 text-sm lowercase text-black tracking-[0.05em] hover:text-[#555555] transition-colors"
                >
                  explore {section.tag}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnimatedSection>
        <section className="bg-black text-[#e5e2e1] py-24 px-6 lg:px-16 my-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-8">
              our philosophy
            </p>
            <blockquote className="text-heading-xl lowercase tracking-tight leading-[1] mb-12">
              &ldquo;we believe in objects that command attention through their quietness.&rdquo;
            </blockquote>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-[#777777] hover:text-white transition-colors lowercase"
            >
              view collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}
