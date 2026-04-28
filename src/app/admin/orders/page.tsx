import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  })

  const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-cherry-800 text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Admin
          </Link>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Orders ({orders.length})</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-dark/50">
                <tr>
                  {['Order ID', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Date'].map(col => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {orders.map(order => {
                  const items = JSON.parse(order.items)
                  return (
                    <tr key={order.id} className="hover:bg-cream-DEFAULT/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.user.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{Array.isArray(items) ? items.length : '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-cherry-800">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
