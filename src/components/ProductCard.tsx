'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import { formatPrice, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  featured: boolean
}

const categoryColors: Record<string, { from: string; to: string; accent: string }> = {
  BODY_CARE: { from: '#E91E8C', to: '#FF79B3', accent: '#FFB3D9' },
  DRY_HAIR: { from: '#FF6B35', to: '#FFB347', accent: '#FFD9A3' },
  CURLY_HAIR: { from: '#7B2FBE', to: '#B47DD9', accent: '#D9B3F5' },
  MASKS: { from: '#E91E8C', to: '#FF5E5B', accent: '#FFB3A3' },
  SHAMPOOS: { from: '#00B09B', to: '#96C93D', accent: '#B3F5D9' },
  SECRET_BOX: { from: '#F7971E', to: '#FFD200', accent: '#FFF5A0' },
}

export default function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const colors = categoryColors[product.category] || { from: '#8B1A4A', to: '#B76E79', accent: '#F4A3B5' }

  async function addToCart() {
    if (!session) { router.push('/login'); return }
    setAdding(true)
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="card-3d group relative rounded-2xl overflow-hidden cursor-pointer" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
      <div className="p-6 h-72 flex flex-col justify-between relative">
        {/* Decorative orbs */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20 animate-float" style={{ background: colors.accent }} />
        <div className="absolute bottom-8 left-2 w-12 h-12 rounded-full opacity-15 animate-float-delay" style={{ background: colors.accent }} />

        <div className="relative z-10">
          <div className="text-4xl mb-3">{getCategoryEmoji(product.category)}</div>
          <span className="bg-black/30 text-white/80 text-xs px-2 py-1 rounded-full">{getCategoryLabel(product.category)}</span>
          {product.featured && (
            <span className="ml-2 bg-champagne/20 text-champagne text-xs px-2 py-1 rounded-full border border-champagne/30">
              <Star className="w-2.5 h-2.5 inline mr-1" />Featured
            </span>
          )}
        </div>

        <div className="relative z-10">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-playfair text-white text-lg font-semibold leading-snug mb-1 group-hover:text-champagne transition-colors">{product.name}</h3>
          </Link>
          <p className="text-white/60 text-xs line-clamp-2 mb-3">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-champagne font-semibold text-lg">{formatPrice(product.price)}</span>
            <button
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-full p-2 transition-all hover:scale-110"
            >
              {added ? '✓' : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
