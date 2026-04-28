'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string; total: number; status: string; createdAt: string
  user: { name: string | null; email: string }
  orderItems: { id: string; quantity: number; product: { name: string } }[]
}

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (session && (session.user as { role?: string }).role !== 'ADMIN') router.push('/')
  }, [session, status, router])

  useEffect(() => {
    if (session && (session.user as { role?: string }).role === 'ADMIN') {
      fetch('/api/admin/orders').then(r => r.json()).then(setOrders).finally(() => setLoading(false))
    }
  }, [session])

  async function updateStatus(orderId: string, newStatus: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
  }

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="text-cream animate-pulse">Loading...</div></div>

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-cream/60 hover:text-rose-300 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="font-script text-rose-300 text-3xl mb-1">Admin</div>
          <h1 className="font-playfair text-4xl font-bold text-cream">Orders ({orders.length})</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-charcoal/60">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{order.user.name || 'Unknown'}</p>
                      <p className="text-charcoal/50 text-xs">{order.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal/60">{order.orderItems.length} items</td>
                    <td className="px-4 py-3 font-semibold text-cherry">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-charcoal/60 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${STATUS_COLORS[order.status] || ''}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
