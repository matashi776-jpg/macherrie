'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/Toaster'
import { ProductCard } from '@/components/ProductCard'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  category: string
  subcategory: string | null
  images: string
  stock: number
  featured: boolean
  createdAt: Date
}

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const { addToast } = useToast()

  const images: string[] = JSON.parse(product.images || '[]')
  const image = images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image, quantity: 1, slug: product.slug })
    }
    setAdded(true)
    addToast(`${product.name} added to cart! 🛍️`)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-cherry-800 text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
              <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {product.comparePrice && (
                <div className="absolute top-6 left-6 bg-cherry-800 text-white text-sm px-4 py-2 rounded-full font-medium">
                  SAVE {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-medium text-rosegold-DEFAULT uppercase tracking-widest">
                {product.subcategory?.replace(/-/g, ' ')}
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C9956C" className="text-rosegold-DEFAULT" />)}
              </div>
              <span className="text-sm text-gray-500">(4.9) · 127 reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-bold text-cherry-800 text-4xl">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-gray-400 line-through text-xl">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-base">{product.description}</p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['Sulfate-Free Formula', 'Ethically Sourced', 'Paraben-Free', 'Dermatologist Tested'].map(benefit => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-cherry-800 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-cream-dark rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-cream-dark transition-colors font-bold text-lg">−</button>
                <span className="w-12 text-center font-semibold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-cream-dark transition-colors font-bold text-lg">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-semibold text-sm tracking-wider uppercase transition-all ${
                  added ? 'bg-green-600 text-white' : 'bg-cherry-800 hover:bg-cherry-700 text-white shadow-lg hover:shadow-cherry-800/30 hover:-translate-y-0.5'
                }`}
              >
                {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles size={14} className="text-rosegold-DEFAULT" />
              <span>Earn <strong className="text-cherry-800">{Math.floor(product.price * 10)} Cherry Points</strong> with this purchase</span>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-gray-900">You May Also Love</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
