'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Star, Package, User, CheckCircle } from 'lucide-react'
import { formatPrice, getCategoryEmoji } from '@/lib/utils'

interface Order {
  id: string; total: number; status: string; createdAt: string
  orderItems: { id: string; quantity: number; price: number; product: { name: string; category: string } }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const justOrdered = searchParams.get('ordered') === 'true'

  const [orders, setOrders] = useState<Order[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session) {
      Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/user/points').then(r => r.json()),
      ]).then(([o, p]) => { setOrders(o); setPoints(p.cherryPoints || 0) }).finally(() => setLoading(false))
    }
  }, [session])

  const user = session?.user as { name?: string; email?: string; role?: string; cherryPoints?: number } | undefined

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="text-cream animate-pulse">Loading...</div></div>

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-script text-cherry text-3xl mb-2">Welcome back</div>
          <h1 className="font-playfair text-4xl font-bold text-cream">{user?.name || 'Cherry Member'}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {justOrdered && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700 font-medium">Order placed successfully! You earned Cherry Points.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-gold/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-champagne/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-champagne" />
              </div>
              <div>
                <p className="text-charcoal/60 text-xs">Cherry Points</p>
                <p className="text-2xl font-bold text-charcoal">{points}</p>
              </div>
            </div>
            <p className="text-charcoal/50 text-xs">{Math.floor(points / 100)} × $5 available to redeem</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-gold/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cherry/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-cherry" />
              </div>
              <div>
                <p className="text-charcoal/60 text-xs">Total Orders</p>
                <p className="text-2xl font-bold text-charcoal">{orders.length}</p>
              </div>
            </div>
            <p className="text-charcoal/50 text-xs">Lifetime purchases</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-gold/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-gold/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-rose-gold" />
              </div>
              <div>
                <p className="text-charcoal/60 text-xs">Total Spent</p>
                <p className="text-2xl font-bold text-charcoal">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</p>
              </div>
            </div>
            <p className="text-charcoal/50 text-xs">All time</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {(['orders', 'profile'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-cherry text-white' : 'bg-white text-charcoal border border-gray-200 hover:border-cherry'}`}>
              {tab === 'orders' ? 'My Orders' : 'Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-charcoal/60">No orders yet. Start shopping!</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-charcoal/50 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
                    <span className="font-bold text-cherry">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 text-xs text-charcoal/70">
                      <span>{getCategoryEmoji(item.product.category)}</span>
                      <span>{item.product.name}</span>
                      <span className="text-charcoal/40">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md">
            <h2 className="font-playfair font-bold text-charcoal mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-charcoal/50 mb-1">Name</label>
                <p className="text-charcoal font-medium">{user?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/50 mb-1">Email</label>
                <p className="text-charcoal font-medium">{user?.email || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/50 mb-1">Membership</label>
                <span className="bg-cherry/10 text-cherry text-xs px-3 py-1 rounded-full font-medium">{user?.role === 'ADMIN' ? 'Admin' : 'Cherry Member'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="min-h-screen bg-dark" />}><DashboardContent /></Suspense>
}
