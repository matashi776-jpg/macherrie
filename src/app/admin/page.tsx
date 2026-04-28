'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Users, ShoppingBag, DollarSign, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Stats { totalOrders: number; totalUsers: number; totalProducts: number; totalRevenue: number }

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (session && (session.user as { role?: string }).role !== 'ADMIN') router.push('/')
  }, [session, status, router])

  useEffect(() => {
    if (session && (session.user as { role?: string }).role === 'ADMIN') {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats)
    }
  }, [session])

  if (!stats) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="text-cream animate-pulse">Loading...</div></div>

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-cherry/10 text-cherry' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Products', value: stats.totalProducts, icon: <Package className="w-5 h-5" />, color: 'bg-champagne/10 text-champagne' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-script text-rose-300 text-3xl mb-2">Admin Panel</div>
          <h1 className="font-playfair text-4xl font-bold text-cream">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
              <p className="text-2xl font-bold text-charcoal">{card.value}</p>
              <p className="text-charcoal/50 text-xs mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { href: '/admin/products', title: 'Manage Products', desc: 'Add, edit, or remove products from the catalog.', icon: <Package className="w-6 h-6" /> },
            { href: '/admin/orders', title: 'Manage Orders', desc: 'View all orders and update their status.', icon: <ShoppingBag className="w-6 h-6" /> },
          ].map(card => (
            <Link key={card.href} href={card.href} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cherry/10 text-cherry rounded-xl flex items-center justify-center">{card.icon}</div>
                <div>
                  <h3 className="font-semibold text-charcoal">{card.title}</h3>
                  <p className="text-charcoal/50 text-sm">{card.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-charcoal/30 group-hover:text-cherry transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
