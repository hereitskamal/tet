export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminCategoriesClient from './AdminCategoriesClient'
import type { Metadata } from 'next'
import type { Category } from '@/types'

export const metadata: Metadata = { title: 'Admin — Categories' }

export default async function AdminCategoriesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <AdminCategoriesClient
      categories={categories as unknown as (Category & { _count: { products: number } })[]}
    />
  )
}