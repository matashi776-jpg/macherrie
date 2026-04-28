import { prisma } from '@/lib/prisma'
import { ProductsClient } from './ProductsClient'

export const metadata = {
  title: 'Products | Ma Cherrie',
  description: 'Browse our full collection of luxury African-Asian hair care products.',
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return <ProductsClient products={products} />
}
