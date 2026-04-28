'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, ShoppingBag, Star, ArrowRight } from 'lucide-react'
import { formatPrice, getCategoryEmoji } from '@/lib/utils'

interface CartItem {
  id: string
  quantity: number
  product: { id: string; name: string; price: number; category: string }
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usePoints, setUsePoints] = useState(false)
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/cart').then(r => r.json()).then(setItems).finally(() => setLoading(false))
      fetch('/api/user/points').then(r => r.json()).then(d => setUserPoints(d.cherryPoints || 0))
    }
  }, [session])

  async function removeItem(itemId: string) {
    await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' })
    setItems(items.filter(i => i.id !== itemId))
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) { await removeItem(itemId); return }
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: items.find(i => i.id === itemId)?.product.id, quantity: quantity - (items.find(i => i.id === itemId)?.quantity || 0) }),
    })
    if (res.ok) {
      const updated = await fetch('/api/cart').then(r => r.json())
      setItems(updated)
    }
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const pointsDiscount = usePoints && userPoints >= 100 ? Math.min(Math.floor(userPoints / 100) * 5, subtotal) : 0
  const total = subtotal - pointsDiscount

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="text-cream animate-pulse">Loading...</div></div>

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-script text-cherry text-3xl mb-2">Your Cart</div>
          <h1 className="font-playfair text-4xl font-bold text-cream">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl text-charcoal mb-3">Your cart is empty</h2>
            <p className="text-charcoal/60 mb-6">Discover our luxurious collection</p>
            <Link href="/products" className="bg-cherry text-white px-8 py-3 rounded-full font-medium hover:bg-cherry/80 transition-all">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl bg-cherry/10 flex-shrink-0">
                    {getCategoryEmoji(item.product.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair font-semibold text-charcoal truncate">{item.product.name}</h3>
                    <p className="text-cherry font-bold">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 text-sm font-medium">−</button>
                    <span className="px-3 py-1 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 text-sm font-medium">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-charcoal text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {userPoints >= 100 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-champagne/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-champagne" />
                    <h3 className="font-semibold text-charcoal text-sm">Cherry Points</h3>
                  </div>
                  <p className="text-charcoal/60 text-xs mb-3">You have {userPoints} points. Use for up to {formatPrice(Math.floor(userPoints / 100) * 5)} off.</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} className="accent-cherry" />
                    <span className="text-sm text-charcoal">Apply Cherry Points discount</span>
                  </label>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-playfair font-bold text-charcoal mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm text-charcoal/70 mb-4">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {pointsDiscount > 0 && <div className="flex justify-between text-green-600"><span>Points Discount</span><span>-{formatPrice(pointsDiscount)}</span></div>}
                  <div className="flex justify-between"><span>Shipping</span><span>{subtotal >= 50 ? 'Free' : formatPrice(5.99)}</span></div>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-charcoal text-lg mb-6">
                  <span>Total</span>
                  <span className="text-cherry">{formatPrice(total + (subtotal < 50 ? 5.99 : 0))}</span>
                </div>
                <Link
                  href={`/checkout?usePoints=${usePoints}`}
                  className="w-full flex items-center justify-center gap-2 bg-cherry text-white py-3 rounded-full font-medium hover:bg-cherry/80 transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
