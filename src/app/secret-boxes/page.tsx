import { prisma } from '@/lib/prisma'
import SecretBoxCard from './SecretBoxCard'
import { Star, Gift, Sparkles } from 'lucide-react'

const BOX_TIERS = [
  { level: 'Bronze', color: { from: '#4A2000', to: '#C87020' }, accent: '#C87020', sparkles: '✨', perks: ['3-4 full-size products', 'Body care essentials', 'Worth over $80', 'Free gift wrapping'] },
  { level: 'Silver', color: { from: '#2A2A3A', to: '#8A8AAA' }, accent: '#C0C0D0', sparkles: '💫', perks: ['5-6 full-size products', 'Hair + Body mix', 'Worth over $130', 'Free gift + card'] },
  { level: 'Gold', color: { from: '#3A2A00', to: '#D4AF37' }, accent: '#D4AF37', sparkles: '⭐', perks: ['7-8 full-size products', 'Full luxury collection', 'Worth over $220', 'Exclusive limited items'] },
  { level: 'Diamond', color: { from: '#1A0A2A', to: '#6A3AAA' }, accent: '#E0D0FF', sparkles: '💎', perks: ['10+ full-size products', 'Exclusive items', 'Worth over $400', 'Personalized note from founders'] },
]

export default async function SecretBoxesPage() {
  const boxes = await prisma.product.findMany({ where: { category: 'SECRET_BOX' }, orderBy: { price: 'asc' } })

  return (
    <div className="min-h-screen bg-dark">
      <div className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-champagne/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cherry/10 rounded-full blur-3xl animate-float-delay" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-champagne/10 border border-champagne/30 rounded-full px-4 py-2 mb-6">
            <Gift className="w-4 h-4 text-champagne" />
            <span className="text-champagne text-sm">Limited Edition Collections</span>
          </div>
          <div className="font-script text-rose-300 text-4xl mb-3">Surprise Yourself</div>
          <h1 className="font-playfair text-5xl font-bold text-cream mb-4">Secret Boxes</h1>
          <p className="text-cream/60 max-w-xl mx-auto">Curated mystery boxes filled with Ma Cherry&apos;s finest products. Each tier offers an extraordinary unboxing experience.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boxes.map((box, i) => {
            const tier = BOX_TIERS[i] || BOX_TIERS[0]
            return (
              <SecretBoxCard key={box.id} box={box} tier={tier} />
            )
          })}
        </div>

        <div className="mt-20 glass-dark rounded-3xl p-10 text-center">
          <Sparkles className="w-10 h-10 text-champagne mx-auto mb-4" />
          <h2 className="font-playfair text-3xl font-bold text-cream mb-3">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { num: '01', title: 'Choose Your Tier', desc: 'Select a box that matches your beauty budget and desires.' },
              { num: '02', title: 'We Curate With Love', desc: 'Our experts handpick products tailored to your tier from our full range.' },
              { num: '03', title: 'Unbox the Magic', desc: 'Receive your secret box and discover premium beauty surprises.' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="text-champagne font-script text-3xl mb-2">{step.num}</div>
                <h3 className="font-playfair text-cream font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-cream/50 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-cherry/10 border border-cherry/30 rounded-2xl p-6 flex items-center gap-4">
          <Star className="w-8 h-8 text-champagne flex-shrink-0" />
          <div>
            <p className="text-cream font-semibold">Earn Cherry Points with every box!</p>
            <p className="text-cream/60 text-sm">You earn Cherry Points equal to your box price. A Diamond Box earns you 249 points!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
