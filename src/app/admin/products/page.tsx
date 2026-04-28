import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminProductsClient } from './AdminProductsClient'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return <AdminProductsClient products={products} />
}
