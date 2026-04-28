import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const boxes = await prisma.secretBox.findMany()
  return NextResponse.json(boxes)
}
