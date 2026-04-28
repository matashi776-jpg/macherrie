import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const { productId, quantity } = await req.json()

  const existing = await prisma.cartItem.findFirst({ where: { userId, productId } })
  if (existing) {
    const item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
      include: { product: true },
    })
    return NextResponse.json(item)
  }
  const item = await prisma.cartItem.create({
    data: { userId, productId, quantity: quantity || 1 },
    include: { product: true },
  })
  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get('itemId')
  if (!itemId) return NextResponse.json({ error: 'Missing itemId' }, { status: 400 })
  await prisma.cartItem.delete({ where: { id: itemId } })
  return NextResponse.json({ ok: true })
}
