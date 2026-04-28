import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { cherryPoints: true } })
  return NextResponse.json({ cherryPoints: user?.cherryPoints || 0 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const { points } = await req.json()
  const user = await prisma.user.update({ where: { id: userId }, data: { cherryPoints: points } })
  return NextResponse.json({ cherryPoints: user.cherryPoints })
}
