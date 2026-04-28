import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'
import Link from 'next/link'
import { ArrowLeft, Star, Shield, Leaf, Sparkles } from 'lucide-react'

const categoryColors: Record<string, { from: string; to: string }> = {
  BODY_CARE: { from: '#8B1A4A', to: '#D4627A' },
  DRY_HAIR: { from: '#7A4F0A', to: '#C4860A' },
  CURLY_HAIR: { from: '#3D1A7A', to: '#7A3DB8' },
  MASKS: { from: '#6A0A1A', to: '#AA2A3A' },
  SHAMPOOS: { from: '#0A4A3A', to: '#1A8A6A' },
  SECRET_BOX: { from: '#5A4A0A', to: '#A07A1A' },
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) notFound()

  const related = await prisma.product.findMany({ where: { category: product.category, id: { not: product.id } }, take: 3 })
  const colors = categoryColors[product.category] || { from: '#8B1A4A', to: '#B76E79' }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-cream/60 hover:text-rose-300 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Visual */}
          <div className="card-3d relative rounded-3xl overflow-hidden h-96" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-8xl mb-4 animate-float">{getCategoryEmoji(product.category)}</div>
              <div className="font-script text-white/60 text-2xl">{getCategoryLabel(product.category)}</div>
            </div>
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full animate-float-delay" />
            <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-float-delay2" />
          </div>

          {/* Product Info */}
          <div className="py-4">
            <span className="bg-cherry/10 text-cherry text-xs px-3 py-1 rounded-full font-medium">{getCategoryLabel(product.category)}</span>
            {product.featured && (
              <span className="ml-2 bg-champagne/10 text-champagne text-xs px-3 py-1 rounded-full font-medium border border-champagne/30">
                <Star className="w-3 h-3 inline mr-1" />Featured
              </span>
            )}

            <h1 className="font-playfair text-4xl font-bold text-charcoal mt-4 mb-3">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-cherry">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-1 text-sm text-charcoal/60">
                <Star className="w-4 h-4 fill-champagne text-champagne" />
                <span>Earn {Math.floor(product.price)} Cherry Points</span>
              </div>
            </div>

            <p className="text-charcoal/70 leading-relaxed mb-8">{product.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Leaf className="w-4 h-4" />, label: 'Natural' },
                { icon: <Shield className="w-4 h-4" />, label: 'Cruelty Free' },
                { icon: <Sparkles className="w-4 h-4" />, label: 'Luxury' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center bg-cream border border-rose-gold/20 rounded-xl p-3 text-center">
                  <div className="text-cherry mb-1">{item.icon}</div>
                  <span className="text-charcoal/60 text-xs">{item.label}</span>
                </div>
              ))}
            </div>

            <AddToCartButton productId={product.id} stock={product.stock} />

            <p className="text-charcoal/40 text-xs mt-4">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} · Free shipping on orders over $50
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-playfair text-2xl font-bold text-charcoal mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(p => {
                const c = categoryColors[p.category] || { from: '#8B1A4A', to: '#B76E79' }
                return (
                  <Link key={p.id} href={`/products/${p.id}`} className="card-3d rounded-2xl overflow-hidden h-48 relative" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                    <div className="p-5 h-full flex flex-col justify-between">
                      <div className="text-3xl">{getCategoryEmoji(p.category)}</div>
                      <div>
                        <h3 className="font-playfair text-white font-semibold">{p.name}</h3>
                        <span className="text-champagne font-bold">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
