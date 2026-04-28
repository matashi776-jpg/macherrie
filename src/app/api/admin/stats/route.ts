import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({ select: { total: true } }),
  ])
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  return NextResponse.json({ totalOrders, totalUsers, totalProducts, totalRevenue })
}
