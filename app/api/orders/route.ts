export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = session.user.role === 'ADMIN'
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      items: body.items,
      total: body.total,
      address: body.address,
    },
    include: { user: { select: { id: true, email: true, name: true } } },
  })

  return NextResponse.json(order, { status: 201 })
}
