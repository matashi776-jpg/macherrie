'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/Toaster'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string
  category: string
  subcategory?: string | null
}

export function ProductCard({ product }: { product: Product }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const { addToast } = useToast()

  const images = JSON.parse(product.images || '[]')
  const image = images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 15, y: -x * 15 })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity: 1,
      slug: product.slug,
    })
    addToast(`${product.name} added to cart! 🛍️`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        transition: 'transform 0.15s ease-out',
      }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-cream-dark/50">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.comparePrice && (
              <div className="absolute top-3 left-3 bg-cherry-800 text-white text-xs px-2 py-1 rounded-full font-medium">
                SALE
              </div>
            )}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(201,149,108,0.15) 0%, transparent 50%, rgba(201,149,108,0.15) 100%)',
              }}
            />
          </div>

          <div className="p-5">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#C9956C" className="text-rosegold-DEFAULT" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.9)</span>
            </div>
            <h3 className="font-serif text-gray-900 font-semibold text-base mb-1 leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 capitalize mb-3">
              {product.subcategory?.replace(/-/g, ' ')}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cherry-800 text-lg">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.comparePrice)}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-cherry-800 hover:bg-cherry-700 text-white rounded-full p-2.5 transition-colors shadow-md hover:shadow-cherry-800/40"
                aria-label="Add to cart"
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
