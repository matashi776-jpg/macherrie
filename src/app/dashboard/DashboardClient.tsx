'use client'
import Link from 'next/link'
import { Sparkles, Package, User, Crown, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface UserData {
  id: string
  name: string | null
  email: string
  role: string
  cherryPoints: number
  createdAt: Date
}

interface Order {
  id: string
  items: string
  total: number
  status: string
  createdAt: Date
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function DashboardClient({ user, orders }: { user: UserData | null; orders: Order[] }) {
  if (!user) return null

  const pointsValue = user.cherryPoints / 100
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-2">Welcome back</p>
          <h1 className="font-serif text-5xl font-bold text-gray-900">{user.name || 'Beautiful'}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-cherry-800 flex items-center justify-center text-white">
                <User size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Calendar size={12} />
              <span>Member since {memberSince}</span>
            </div>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="mt-3 block text-center text-xs font-medium text-rosegold-DEFAULT border border-rosegold-DEFAULT rounded-full py-1.5 hover:bg-rosegold-DEFAULT hover:text-white transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Cherry Points Card */}
          <div className="bg-cherry-800 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-rosegold-DEFAULT" />
                <span className="text-sm font-medium text-white/80">Cherry Points</span>
              </div>
              <p className="font-serif text-5xl font-bold text-white mb-1">{user.cherryPoints.toLocaleString()}</p>
              <p className="text-white/60 text-sm">≈ {formatPrice(pointsValue)} in rewards</p>
              <Link href="/products" className="mt-4 inline-block text-xs bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-2 transition-colors">
                Earn more points →
              </Link>
            </div>
          </div>

          {/* Orders summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-cherry-800">
                <Package size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Total Orders</p>
                <p className="text-2xl font-bold text-cherry-800">{orders.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Total spent: <strong className="text-gray-700">{formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}</strong>
            </p>
            {user.role !== 'ADMIN' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rosegold-DEFAULT">
                <Crown size={12} />
                <span>
                  {orders.length >= 5 ? 'VIP Member 👑' : orders.length >= 3 ? 'Silver Member ✦' : 'Bronze Member'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          <div className="p-6 border-b border-cream-dark">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Order History</h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 mb-4">No orders yet</p>
              <Link href="/products" className="btn-luxury rounded-full inline-flex items-center gap-2 text-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-dark/50">
                  <tr>
                    {['Order ID', 'Date', 'Items', 'Total', 'Status'].map(col => (
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
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{Array.isArray(items) ? items.length : '–'} items</td>
                        <td className="px-6 py-4 text-sm font-semibold text-cherry-800">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
