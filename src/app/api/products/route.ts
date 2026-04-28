import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  const featured = searchParams.get('featured')

  const where: any = {}
  if (category) where.category = category
  if (subcategory) where.subcategory = subcategory
  if (featured === 'true') where.featured = true

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await request.json()
  const product = await prisma.product.create({ data })
  return NextResponse.json(product)
}
