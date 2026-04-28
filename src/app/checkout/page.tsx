'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatPrice, getCategoryEmoji } from '@/lib/utils'
import { ShieldCheck, Star } from 'lucide-react'

interface CartItem {
  id: string; quantity: number; product: { id: string; name: string; price: number; category: string }
}

function CheckoutContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const usePoints = searchParams.get('usePoints') === 'true'

  const [items, setItems] = useState<CartItem[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', card: '4242 4242 4242 4242', expiry: '12/27', cvv: '123' })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/cart').then(r => r.json()).then(setItems)
      fetch('/api/user/points').then(r => r.json()).then(d => setUserPoints(d.cherryPoints || 0))
      const u = session.user as { name?: string; email?: string }
      setForm(f => ({ ...f, name: u.name || '', email: u.email || '' }))
    }
  }, [session])

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const pointsDiscount = usePoints && userPoints >= 100 ? Math.min(Math.floor(userPoints / 100) * 5, subtotal) : 0
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal - pointsDiscount + shipping

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault()
    setPlacing(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usePoints }),
    })
    if (res.ok) {
      router.push('/dashboard?ordered=true')
    } else {
      setPlacing(false)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-script text-rose-300 text-3xl mb-2">Almost There</div>
          <h1 className="font-playfair text-4xl font-bold text-cream">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-playfair font-bold text-charcoal mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-4">
                {([
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Address', key: 'address', type: 'text' },
                  { label: 'City', key: 'city', type: 'text' },
                  { label: 'ZIP Code', key: 'zip', type: 'text' },
                ] as const).map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <h2 className="font-playfair font-bold text-charcoal">Payment (Demo)</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <p className="text-green-700 text-xs font-medium">🔒 Demo Mode - No real payment will be processed</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Card Number</label>
                  <input value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Expiry</label>
                    <input value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30 font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">CVV</label>
                    <input value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30 font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-playfair font-bold text-charcoal mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cherry/10 flex items-center justify-center text-lg flex-shrink-0">{getCategoryEmoji(item.product.category)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{item.product.name}</p>
                      <p className="text-xs text-charcoal/50">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-cherry">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-charcoal/70 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {pointsDiscount > 0 && <div className="flex justify-between text-green-600"><span>Points Discount</span><span>-{formatPrice(pointsDiscount)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-charcoal text-lg mb-2">
                <span>Total</span><span className="text-cherry">{formatPrice(total)}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-champagne mb-6">
                <Star className="w-3 h-3" />
                <span>You&apos;ll earn {Math.floor(total)} Cherry Points!</span>
              </div>

              <button type="submit" disabled={placing || items.length === 0} className="w-full bg-cherry text-white py-3 rounded-full font-semibold hover:bg-cherry/80 disabled:opacity-50 transition-all hover:scale-105">
                {placing ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen bg-dark" />}><CheckoutContent /></Suspense>
}
