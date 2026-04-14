export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import type { Metadata } from 'next'
import type { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  return product as unknown as Product | null
}

async function getRelated(categoryId: string, excludeId: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, NOT: { id: excludeId } },
    include: { category: true },
    take: 4,
  })
  return products as unknown as Product[]
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelated(product.categoryId, product.id)

  return <ProductDetailClient product={product} related={related} />
}
