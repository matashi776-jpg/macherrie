'use client'
import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Box {
  id: string; name: string; description: string; price: number; stock: number
}
interface Tier {
  level: string; color: { from: string; to: string }; accent: string; sparkles: string; perks: string[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function SecretBoxCard({ box, tier }: { box: Box; tier: Tier }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function addToCart() {
    if (!session) { router.push('/login'); return }
    setAdding(true)
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: box.id, quantity: 1 }),
    })
    setAdded(true)
    setAdding(false)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="card-3d rounded-3xl overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${tier.color.from}, ${tier.color.to})` }}>
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{tier.sparkles}</div>
          <div className="text-4xl font-script mb-1" style={{ color: tier.accent }}>{tier.level}</div>
          <div className="font-playfair text-white font-semibold text-lg">{box.name}</div>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-white">{formatPrice(box.price)}</div>
          <div className="text-white/50 text-xs mt-1">{box.stock} boxes remaining</div>
        </div>

        <ul className="space-y-2 mb-6">
          {tier.perks.map(perk => (
            <li key={perk} className="flex items-center gap-2 text-white/80 text-sm">
              <Check className="w-3 h-3 flex-shrink-0" style={{ color: tier.accent }} />
              {perk}
            </li>
          ))}
        </ul>

        <p className="text-white/50 text-xs mb-4 line-clamp-2">{box.description}</p>

        <button
          onClick={addToCart}
          disabled={adding || box.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: tier.accent, color: '#1A0A0F' }}
        >
          {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
        </button>
      </div>
    </div>
  )
}
