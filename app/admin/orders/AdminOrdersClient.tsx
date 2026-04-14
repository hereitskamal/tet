'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const statuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-[#e2e2e2] text-[#777777]',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-yellow-50 text-yellow-700',
  DELIVERED: 'bg-[#3b3d2b]/10 text-[#3b3d2b]',
  CANCELLED: 'bg-[#ba1a1a]/10 text-[#ba1a1a]',
}

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id)
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdatingId(null)
    router.refresh()
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">admin</p>
          <h1 className="text-display font-semibold lowercase tracking-tight">orders.</h1>
          <p className="text-sm text-[#777777] mt-2">
            {orders.length} orders · {formatPrice(totalRevenue)} revenue
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                {['order id', 'customer', 'items', 'total', 'status', 'date'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-[0.1em] uppercase text-[#777777] pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const items = order.items as Array<{ name: string; quantity: number }>
                return (
                  <motion.tr
                    key={order.id}
                    layout
                    className="border-b border-[#f3f3f4] hover:bg-[#f3f3f4] transition-colors"
                  >
                    <td className="py-4 pr-4 font-mono text-xs text-[#777777]">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 lowercase">
                      <div>
                        <p className="font-medium">{order.user?.name || '—'}</p>
                        <p className="text-xs text-[#777777]">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-[#777777] text-xs max-w-[180px]">
                      {Array.isArray(items) ? items.map((i) => `${i.name} ×${i.quantity}`).join(', ') : '—'}
                    </td>
                    <td className="py-4 pr-4 font-bold">{formatPrice(order.total)}</td>
                    <td className="py-4 pr-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className={`text-xs tracking-[0.05em] uppercase px-2 py-1 rounded-full border-0 outline-none cursor-pointer disabled:opacity-60 ${
                          statusColors[order.status]
                        }`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s.toLowerCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 text-[#777777] text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
