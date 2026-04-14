export const dynamic = 'force-dynamic'

import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Package, LogOut } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account' }

type OrderItem = { name: string; price: number; quantity: number; image?: string }
type OrderAddress = { line1: string; line2?: string; city: string; state: string; zip: string; country: string }
type Order = {
  id: string
  userId: string
  items: unknown
  total: number
  status: string
  address: unknown
  createdAt: Date
  updatedAt: Date
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?redirect=/account')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">account</p>
            <h1 className="text-display lowercase tracking-tight">
              {session.user.name?.split(' ')[0] || 'hello'}.
            </h1>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-[#777777] hover:text-black transition-colors lowercase tracking-[0.05em]"
            >
              <LogOut className="w-4 h-4" />
              sign out
            </button>
          </form>
        </div>

        {/* Profile */}
        <div className="bg-[#f3f3f4] rounded-sm p-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#777777] mb-1">name</p>
              <p className="text-sm lowercase">{session.user.name || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#777777] mb-1">email</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-heading-md lowercase tracking-tight mb-6">orders</h2>

          {orders.length === 0 ? (
            <div className="text-center py-20 text-[#777777]">
              <Package className="w-8 h-8 mx-auto mb-4 opacity-30" />
              <p className="text-sm lowercase">no orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => {
                const items = order.items as OrderItem[]
                const address = order.address as OrderAddress
                return (
                  <div key={order.id} className="border border-[#e2e2e2] rounded-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-mono text-xs text-[#777777] mb-1">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-[#777777]">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs tracking-[0.05em] uppercase px-2 py-1 rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-[#3b3d2b]/10 text-[#3b3d2b]' :
                          order.status === 'CANCELLED' ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]' :
                          'bg-[#e2e2e2] text-[#777777]'
                        }`}>
                          {order.status.toLowerCase()}
                        </span>
                        <p className="font-black text-sm mt-2">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-[#777777]">
                          <span className="lowercase">{item.name} × {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-[#777777] lowercase border-t border-[#f3f3f4] pt-3">
                      {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.zip}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
