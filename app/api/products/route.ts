export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const min = parseFloat(searchParams.get('min') || '0') || 0
  const max = parseFloat(searchParams.get('max') || '0') || 0
  const featured = searchParams.get('featured') === 'true'
  const limit = parseInt(searchParams.get('limit') || '50')

  const products = await prisma.product.findMany({
    where: {
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(min && { price: { gte: min } }),
      ...(max && { price: { lte: max } }),
      ...(featured && { featured: true }),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const product = await prisma.product.create({
    data: body,
    include: { category: true },
  })

  return NextResponse.json(product, { status: 201 })
}
