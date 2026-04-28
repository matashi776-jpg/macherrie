import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = (session.user as any).role === 'ADMIN'
  const userId = (session.user as any).id

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { items, total, pointsUsed } = await request.json()

  const order = await prisma.order.create({
    data: {
      userId,
      items: JSON.stringify(items),
      total,
      status: 'PENDING',
    },
  })

  const pointsEarned = Math.floor(total * 10)
  await prisma.user.update({
    where: { id: userId },
    data: {
      cherryPoints: {
        increment: pointsEarned - (pointsUsed || 0),
      },
    },
  })

  return NextResponse.json(order)
}
