import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Crown } from 'lucide-react'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, cherryPoints: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-cherry-800 text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Admin
          </Link>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Users ({users.length})</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-dark/50">
                <tr>
                  {['Name', 'Email', 'Role', 'Cherry Points', 'Joined'].map(col => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-cream-DEFAULT/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 bg-cherry-100 text-cherry-800 text-xs px-2 py-1 rounded-full font-semibold">
                          <Crown size={10} /> Admin
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-rosegold-DEFAULT">{user.cherryPoints.toLocaleString()} pts</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
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
