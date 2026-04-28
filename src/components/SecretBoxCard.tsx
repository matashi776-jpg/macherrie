'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const tierColors = {
  BRONZE: { gradient: 'from-amber-700 via-amber-600 to-amber-800', accent: '#CD7F32', glow: 'rgba(205,127,50,0.5)' },
  SILVER: { gradient: 'from-gray-400 via-gray-300 to-gray-500', accent: '#C0C0C0', glow: 'rgba(192,192,192,0.5)' },
  GOLD: { gradient: 'from-yellow-600 via-yellow-400 to-yellow-700', accent: '#FFD700', glow: 'rgba(255,215,0,0.5)' },
  DIAMOND: { gradient: 'from-blue-400 via-purple-300 to-pink-400', accent: '#B9F2FF', glow: 'rgba(185,242,255,0.7)' },
}

interface SecretBox {
  id: string
  name: string
  tier: string
  price: number
  description: string
  items: string
  image: string
}

export function SecretBoxCard({ box }: { box: SecretBox }) {
  const [flipped, setFlipped] = useState(false)
  const tier = tierColors[box.tier as keyof typeof tierColors] || tierColors.BRONZE
  const items: string[] = JSON.parse(box.items || '[]')

  return (
    <div
      className="relative h-[500px] cursor-pointer"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="w-full h-full relative transition-all duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-90`} />
          <Image
            src={box.image}
            alt={box.name}
            fill
            className="object-cover mix-blend-overlay opacity-60"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
            <div className="mb-4" style={{ filter: `drop-shadow(0 0 20px ${tier.glow})` }}>
              <Sparkles size={48} style={{ color: tier.accent }} />
            </div>
            <div className="text-xs font-medium tracking-[0.3em] uppercase mb-2 opacity-80">{box.tier} TIER</div>
            <h3 className="font-serif text-3xl font-bold mb-3">{box.name}</h3>
            <div className="text-4xl font-bold mb-4" style={{ color: tier.accent }}>
              {formatPrice(box.price)}
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{box.description.slice(0, 100)}...</p>
            <div className="mt-6 text-xs tracking-widest uppercase opacity-60">Hover to reveal</div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient}`} />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col p-8 text-white">
            <div className="text-xs font-medium tracking-[0.3em] uppercase mb-2 opacity-60">{box.tier} TIER</div>
            <h3 className="font-serif text-2xl font-bold mb-6">{box.name}</h3>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: tier.accent, flexShrink: 0 }} />
                  <span className="opacity-90">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/secret-boxes"
              className="mt-6 block text-center py-3 px-6 rounded-full font-semibold text-black transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: tier.accent }}
              onClick={e => e.stopPropagation()}
            >
              Get This Box — {formatPrice(box.price)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
