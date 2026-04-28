import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetail } from './ProductDetail'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { subcategory: product.subcategory, slug: { not: product.slug } },
    take: 4,
  })

  return <ProductDetail product={product} related={related} />
}
