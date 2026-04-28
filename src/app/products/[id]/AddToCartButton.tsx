'use client'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function addToCart() {
    if (!session) { router.push('/login'); return }
    setAdding(true)
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    setAdded(true)
    setAdding(false)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 font-medium">−</button>
        <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
        <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="px-4 py-2 hover:bg-gray-100 font-medium">+</button>
      </div>
      <button
        onClick={addToCart}
        disabled={adding || stock === 0}
        className="flex-1 flex items-center justify-center gap-2 bg-cherry hover:bg-cherry/80 disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all hover:scale-105"
      >
        <ShoppingBag className="w-5 h-5" />
        {added ? 'Added to Cart! ✓' : stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}
