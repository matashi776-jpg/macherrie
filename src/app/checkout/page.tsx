'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatPrice } from '@/lib/utils'
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  cardNumber: z.string().min(16, 'Card number is required').max(19),
  expiry: z.string().min(5, 'Expiry is required'),
  cvv: z.string().min(3, 'CVV is required').max(4),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      country: 'United States',
    },
  })

  const orderTotal = total()

  const onSubmit = async (_data: FormData) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: orderTotal }),
      })
      if (res.ok) {
        clearCart()
        setSubmitted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="btn-luxury rounded-full">Shop Now</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your luxury purchase. You&apos;ll receive a confirmation email shortly.</p>
          <p className="text-cherry-800 font-semibold mb-8">Cherry Points have been added to your account! ✦</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-luxury rounded-full">Continue Shopping</Link>
            <Link href="/dashboard" className="border-2 border-cherry-800 text-cherry-800 hover:bg-cherry-800 hover:text-white px-6 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all">My Orders</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-cherry-800 text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-5">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'name', label: 'Full Name', type: 'text', colSpan: 2 },
                  { id: 'email', label: 'Email Address', type: 'email', colSpan: 2 },
                  { id: 'address', label: 'Street Address', type: 'text', colSpan: 2 },
                  { id: 'city', label: 'City', type: 'text', colSpan: 1 },
                  { id: 'zip', label: 'ZIP Code', type: 'text', colSpan: 1 },
                  { id: 'country', label: 'Country', type: 'text', colSpan: 2 },
                ].map(field => (
                  <div key={field.id} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      {...register(field.id as keyof FormData)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800 transition-colors"
                    />
                    {errors[field.id as keyof FormData] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.id as keyof FormData]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-serif text-xl font-bold text-gray-900">Payment</h2>
                <Lock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">Secure checkout</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      {...register('cardNumber')}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800 transition-colors pr-12"
                    />
                    <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Expiry</label>
                    <input type="text" placeholder="MM/YY" {...register('expiry')} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800 transition-colors" />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CVV</label>
                    <input type="text" placeholder="123" {...register('cvv')} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800 transition-colors" />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury rounded-full w-full flex items-center justify-center gap-2 py-4 disabled:opacity-70"
            >
              {loading ? 'Processing...' : `Place Order — ${formatPrice(orderTotal)}`}
            </button>
            {!session && (
              <p className="text-xs text-center text-gray-500">
                <Link href="/auth/signin" className="text-cherry-800 underline">Sign in</Link> to earn Cherry Points on this order.
              </p>
            )}
          </form>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark sticky top-28">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute -top-1 -right-1 bg-cherry-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(orderTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span><span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 mt-2 pt-2 border-t border-gray-100">
                  <span>Total</span><span className="text-cherry-800">{formatPrice(orderTotal)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-cherry-50 rounded-xl border border-cherry-100">
                <p className="text-xs text-cherry-800 font-medium text-center">
                  🍒 Earn {Math.floor(orderTotal * 10)} Cherry Points with this order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
