export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminOrdersClient from './AdminOrdersClient'
import type { Metadata } from 'next'
import type { Order } from '@/types'

export const metadata: Metadata = { title: 'Admin — Orders' }

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const orders = await prisma.order.findMany({
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return <AdminOrdersClient orders={orders as unknown as Order[]} />
}
