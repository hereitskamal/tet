export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminProductsClient from './AdminProductsClient'
import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

export const metadata: Metadata = { title: 'Admin — Products' }

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <AdminProductsClient
      products={products as unknown as Product[]}
      categories={categories as Category[]}
    />
  )
}
