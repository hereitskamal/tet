export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingBag, DollarSign, Users, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const [productCount, orderCount, userCount, categoryCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { email: true, name: true } } },
    }),
  ])

  const revenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0)

  const stats = [
    { label: 'products', value: productCount, icon: Package, href: '/admin/products' },
    { label: 'categories', value: categoryCount, icon: Tag, href: '/admin/categories' },
    { label: 'orders', value: orderCount, icon: ShoppingBag, href: '/admin/orders' },
    { label: 'revenue', value: formatPrice(revenue), icon: DollarSign, href: '/admin/orders' },
    { label: 'users', value: userCount, icon: Users, href: '#' },
  ]

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">admin</p>
          <h1 className="text-display lowercase tracking-tight">dashboard.</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-[#f3f3f4] p-6 rounded-sm hover:bg-[#e2e2e2] transition-colors group"
            >
              <stat.icon className="w-5 h-5 text-[#777777] mb-4 group-hover:text-black transition-colors" />
              <p className="text-2xl font-black tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-[#777777] lowercase tracking-[0.05em]">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Nav */}
        <div className="flex gap-4 mb-12">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-black text-[#e5e2e1] px-6 py-3 rounded-full text-sm lowercase tracking-[0.05em] font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            manage products
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 border border-black text-black px-6 py-3 rounded-full text-sm lowercase tracking-[0.05em] font-medium hover:bg-black hover:text-[#e5e2e1] transition-colors"
          >
            manage categories
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 border border-black text-black px-6 py-3 rounded-full text-sm lowercase tracking-[0.05em] font-medium hover:bg-black hover:text-[#e5e2e1] transition-colors"
          >
            manage orders
          </Link>
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-black lowercase tracking-tight text-xl mb-6">recent orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e2e2]">
                  {['order id', 'customer', 'total', 'status', 'date'].map((h) => (
                    <th key={h} className="text-left text-[10px] tracking-[0.1em] uppercase text-[#777777] pb-3 pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(orders as Array<{ id: string; user: { name?: string | null; email: string }; total: number; status: string; createdAt: Date }>).map((order) => (
                  <tr key={order.id} className="border-b border-[#f3f3f4] hover:bg-[#f9f9f9]">
                    <td className="py-4 pr-6 font-mono text-xs text-[#777777]">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-6 lowercase">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="py-4 pr-6 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-4 pr-6">
                      <span className={`text-xs tracking-[0.05em] uppercase px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-[#3b3d2b]/10 text-[#3b3d2b]' :
                        order.status === 'CANCELLED' ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]' :
                        'bg-[#e2e2e2] text-[#777777]'
                      }`}>
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 text-[#777777] text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
