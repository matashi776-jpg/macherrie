import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Users, ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const [productCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true, email: true } } } }),
  ])

  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } })

  const stats = [
    { label: 'Total Products', value: productCount, icon: <Package size={24} />, color: 'bg-blue-500', href: '/admin/products' },
    { label: 'Total Users', value: userCount, icon: <Users size={24} />, color: 'bg-green-500', href: '/admin/users' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={24} />, color: 'bg-cherry-800', href: '/admin/orders' },
    { label: 'Revenue', value: formatPrice(totalRevenue._sum.total || 0), icon: <TrendingUp size={24} />, color: 'bg-rosegold-DEFAULT', href: '/admin/orders' },
  ]

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-2">Admin Dashboard</p>
          <h1 className="font-serif text-5xl font-bold text-gray-900">Overview</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href} className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Manage Products', desc: 'Add, edit, or remove products from the catalog', href: '/admin/products', color: 'from-blue-500 to-blue-600' },
            { title: 'View Orders', desc: 'Track and manage all customer orders', href: '/admin/orders', color: 'from-cherry-800 to-cherry-700' },
            { title: 'User Management', desc: 'View and manage registered customers', href: '/admin/users', color: 'from-rosegold-DEFAULT to-rosegold-dark' },
          ].map((action, i) => (
            <Link key={i} href={action.href} className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all group`}>
              <h3 className="font-serif text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-white/70 text-sm mb-4">{action.desc}</p>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          <div className="p-6 border-b border-cream-dark flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-cherry-800 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-dark/50">
                <tr>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(col => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-cream-DEFAULT/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.user.name || order.user.email}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-cherry-800">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
