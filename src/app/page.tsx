import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { ArrowRight, Star, Sparkles, Shield, Leaf } from 'lucide-react'
import { getCategoryLabel, getCategoryEmoji } from '@/lib/utils'

const CATEGORIES = ['BODY_CARE', 'DRY_HAIR', 'CURLY_HAIR', 'MASKS', 'SHAMPOOS', 'SECRET_BOX']

const categoryBgs: Record<string, string> = {
  BODY_CARE: 'from-fuchsia-500 to-pink-400',
  DRY_HAIR: 'from-orange-500 to-amber-400',
  CURLY_HAIR: 'from-purple-600 to-violet-500',
  MASKS: 'from-rose-500 to-fuchsia-400',
  SHAMPOOS: 'from-emerald-500 to-teal-400',
  SECRET_BOX: 'from-yellow-500 to-amber-400',
}

export default async function HomePage() {
  const featured = await prisma.product.findMany({ where: { featured: true }, take: 6 })

  const testimonials = [
    { name: 'Amara K.', text: 'The Cherry Blossom Body Butter transformed my skin. I get compliments daily!', rating: 5 },
    { name: 'Yuki T.', text: 'Finally a brand that understands both African and Asian beauty needs. Obsessed!', rating: 5 },
    { name: 'Fatou D.', text: 'The Curl Awakening Cream is a miracle product for my 4C hair. My curls have never looked better.', rating: 5 },
  ]

  return (
    <div>
      <HeroSection />

      {/* Featured Products */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-script text-cherry text-3xl mb-2">Bestsellers</div>
            <h2 className="font-playfair text-4xl font-bold text-charcoal">Featured Products</h2>
            <p className="text-charcoal/60 mt-3 max-w-xl mx-auto">Handpicked by our beauty experts, loved by thousands worldwide</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center gap-2 bg-cherry text-white px-8 py-3 rounded-full font-medium hover:bg-cherry/80 transition-all hover:scale-105">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-script text-cherry text-3xl mb-2">Collections</div>
            <h2 className="font-playfair text-4xl font-bold text-cream">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/products?category=${cat}`} className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${categoryBgs[cat]} p-8 hover:scale-105 transition-all duration-300`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{getCategoryEmoji(cat)}</div>
                  <h3 className="font-playfair text-white text-lg font-semibold">{getCategoryLabel(cat)}</h3>
                  <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                    <span>Shop now</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-script text-cherry text-3xl mb-4">Our Story</div>
              <h2 className="font-playfair text-4xl font-bold text-cream mb-6">Beauty Without Borders</h2>
              <p className="text-cream/60 leading-relaxed mb-4">
                MA space Cherrie was born from a belief that the world&apos;s most powerful beauty secrets live in ancient traditions 
                — from the shea forests of West Africa to the camellia gardens of Japan.
              </p>
              <p className="text-cream/60 leading-relaxed mb-8">
                We bridge two worlds, creating luxury formulas that honor both African richness and Asian precision. 
                Every product is a ritual, every ingredient tells a story.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: <Leaf className="w-5 h-5" />, label: 'Natural Ingredients' },
                  { icon: <Shield className="w-5 h-5" />, label: 'Cruelty Free' },
                  { icon: <Sparkles className="w-5 h-5" />, label: 'Luxury Quality' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="w-12 h-12 bg-cherry/20 border border-cherry/30 rounded-xl flex items-center justify-center text-cherry mx-auto mb-2">{item.icon}</div>
                    <p className="text-cream/70 text-xs font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-cherry to-rose-gold flex items-center justify-center">
                <div className="text-center">
                  <div className="font-script text-white text-6xl mb-3">Ma Cherrie</div>
                  <p className="text-white/70 text-sm">Luxury Beauty, Inspired by the World</p>
                </div>
                <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full animate-float" />
                <div className="absolute bottom-8 left-8 w-14 h-14 bg-champagne/20 rounded-full animate-float-delay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cherry Points Banner */}
      <section className="py-16 bg-cherry-gradient">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="w-10 h-10 text-champagne mx-auto mb-4" />
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">Cherry Points Rewards</h2>
          <p className="text-white/80 mb-2">Earn 1 Cherry Point for every $1 you spend.</p>
          <p className="text-white/80 mb-6">Redeem 100 points for $5 off your next order.</p>
          <Link href="/register" className="bg-champagne text-charcoal px-8 py-3 rounded-full font-semibold hover:bg-champagne/80 transition-all hover:scale-105 inline-block">
            Join & Start Earning
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-script text-cherry text-3xl mb-2">Reviews</div>
            <h2 className="font-playfair text-4xl font-bold text-charcoal">Loved by Thousands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-rose-gold/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-champagne text-champagne" />)}
                </div>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="font-semibold text-charcoal text-sm">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
