import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const { usePoints } = await req.json()

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })
  if (cartItems.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let discount = 0
  let pointsUsed = 0
  if (usePoints && user.cherryPoints >= 100) {
    const maxDiscount = Math.floor(user.cherryPoints / 100) * 5
    discount = Math.min(maxDiscount, subtotal)
    pointsUsed = Math.ceil(discount / 5) * 100
  }
  const total = Math.max(0, subtotal - discount)
  const pointsEarned = Math.floor(total)

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      orderItems: {
        create: cartItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    },
    include: { orderItems: { include: { product: true } } },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { cherryPoints: { increment: pointsEarned - pointsUsed } },
  })

  await prisma.cartItem.deleteMany({ where: { userId } })

  return NextResponse.json(order, { status: 201 })
}
