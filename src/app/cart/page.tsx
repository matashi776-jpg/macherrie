'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useSession } from 'next-auth/react'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const { data: session } = useSession()
  const [pointsToRedeem, setPointsToRedeem] = useState(0)

  const subtotal = total()
  const discount = pointsToRedeem / 100
  const finalTotal = Math.max(0, subtotal - discount)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Discover our luxury collection and treat yourself.</p>
          <Link href="/products" className="btn-luxury rounded-full inline-flex items-center gap-2">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark flex gap-6 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-gray-900 text-base truncate">{item.name}</h3>
                  <p className="text-cherry-800 font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-gray-900 mb-2">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark sticky top-28">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {session && (
                <div className="mb-6 p-4 bg-cherry-50 rounded-xl border border-cherry-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-cherry-800" />
                    <span className="text-sm font-semibold text-cherry-800">Cherry Points</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Enter points to redeem (100 pts = $1)</p>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="100"
                    value={pointsToRedeem}
                    onChange={e => setPointsToRedeem(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cherry-800"
                    placeholder="Enter points (e.g. 500)"
                  />
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Points Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span className="text-cherry-800">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-luxury rounded-full w-full flex items-center justify-center gap-2 text-center"
              >
                Checkout <ArrowRight size={16} />
              </Link>

              <Link href="/products" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
