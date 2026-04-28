import { Hero3D } from '@/components/Hero3D'
import { ProductCard } from '@/components/ProductCard'
import { SecretBoxCard } from '@/components/SecretBoxCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Star, Sparkles, Shield, Heart, Zap } from 'lucide-react'

async function getFeaturedProducts() {
  return prisma.product.findMany({ where: { featured: true }, take: 6 })
}

async function getSecretBoxes() {
  return prisma.secretBox.findMany()
}

export default async function Home() {
  const [featuredProducts, secretBoxes] = await Promise.all([
    getFeaturedProducts(),
    getSecretBoxes(),
  ])

  const categories = [
    { name: 'Dry Hair Care', slug: 'dry-hair', description: 'Intense hydration for parched strands', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop', count: 4 },
    { name: 'Curly Hair Care', slug: 'curly-hair', description: 'Define and celebrate every curl', image: 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=800&h=600&fit=crop', count: 4 },
    { name: 'Hair Masks', slug: 'masks', description: 'Transformative treatments for all types', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c51?w=800&h=600&fit=crop', count: 4 },
    { name: 'Shampoos', slug: 'shampoos', description: 'Cleanse with purpose and luxury', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=600&fit=crop', count: 4 },
    { name: 'Conditioners', slug: 'conditioners', description: 'Silken finish for every strand', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop', count: 3 },
  ]

  const testimonials = [
    { name: 'Amara K.', text: 'The Cherry Blossom Repair Mask transformed my damaged hair in just one use. I cannot believe I lived without this.', rating: 5, location: 'Lagos, Nigeria' },
    { name: 'Yuki T.', text: 'As someone who blends Japanese and African heritage, Ma Cherrie truly speaks to my soul. The scents are heavenly.', rating: 5, location: 'Tokyo, Japan' },
    { name: 'Sophia M.', text: "The Curl Defining Pudding gave me the most defined curls I've ever had. My friends thought I had a professional blowout!", rating: 5, location: 'Atlanta, USA' },
    { name: 'Fatima A.', text: 'I splurged on the Diamond Box and it was worth every single dollar. The packaging alone made me cry happy tears.', rating: 5, location: 'Dubai, UAE' },
  ]

  return (
    <>
      <Hero3D />

      {/* Marquee strip */}
      <div className="bg-cherry-800 py-4 overflow-hidden">
        <div className="flex gap-0 animate-scroll whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 flex-shrink-0">
              {['African Botanicals', '✦', 'Asian Precision', '✦', 'Zero Compromise', '✦', 'Luxury Hair Care', '✦', 'Cherry Points Rewards', '✦'].map((text, j) => (
                <span
                  key={j}
                  className={`text-sm font-medium tracking-[0.2em] uppercase ${text === '✦' ? 'text-rosegold-DEFAULT' : 'text-white/80'}`}
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-24 bg-cream-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-3">Our Bestsellers</p>
            <h2 className="font-serif text-5xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Each formula is a masterpiece—crafted at the intersection of African herbal wisdom and Japanese cosmetic science.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-cherry-800 text-cherry-800 hover:bg-cherry-800 hover:text-white px-10 py-4 rounded-full font-medium tracking-wider uppercase transition-all"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-3">Explore Our Range</p>
            <h2 className="font-serif text-5xl font-bold text-white mb-4">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/products?subcategory=${cat.slug}`}
                className="group relative h-72 rounded-2xl overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-white text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{cat.description}</p>
                  <div className="flex items-center gap-2 text-rosegold-DEFAULT text-sm font-medium">
                    Shop {cat.count} products <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Secret Boxes */}
      <section className="py-24 bg-cream-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-3">The Ultimate Surprise</p>
            <h2 className="font-serif text-5xl font-bold text-gray-900 mb-4">Mystery Boxes</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Four tiers of curated luxury. Each box is a journey—hover to reveal what awaits you inside.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secretBoxes.map(box => (
              <SecretBoxCard key={box.id} box={box} />
            ))}
          </div>
        </div>
      </section>

      {/* Cherry Points Section */}
      <section className="py-24 bg-cherry-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Sparkles className="mx-auto mb-4 text-rosegold-DEFAULT" size={48} />
            <h2 className="font-serif text-5xl font-bold text-white mb-4">Cherry Points</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-12 text-lg">
              Earn rewards every time you shop. Our exclusive loyalty program turns your passion for beautiful hair into incredible savings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={32} />, title: 'Earn 10 Points per $1', desc: 'Every dollar you spend earns you 10 Cherry Points. Points add up fast with our range of luxury products.' },
              { icon: <Heart size={32} />, title: '100 Points = $1 Off', desc: 'Redeem your Cherry Points at checkout. 100 points equals $1 off your next luxurious purchase.' },
              { icon: <Shield size={32} />, title: 'Welcome Bonus', desc: "Create your account today and receive 100 Cherry Points as a welcome gift — that's $1 to spend immediately." },
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white border border-white/20">
                <div className="text-rosegold-DEFAULT mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-serif text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-rosegold-DEFAULT hover:bg-rosegold-dark text-white px-10 py-4 rounded-full font-medium tracking-wider uppercase transition-all"
            >
              Join & Earn Points <Sparkles size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-3">Our Community</p>
            <h2 className="font-serif text-5xl font-bold text-white mb-4">What Our Queens Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-rosegold-DEFAULT/30 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="#C9956C" className="text-rosegold-DEFAULT" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-2xl mx-auto text-center px-4">
          <Sparkles className="mx-auto mb-4 text-cherry-800" size={32} />
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Join the Inner Circle</h2>
          <p className="text-gray-600 mb-8">
            Be the first to discover new formulations, exclusive offers, and beauty secrets from both continents.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-full border-2 border-cherry-200 focus:outline-none focus:border-cherry-800 bg-white text-gray-900"
            />
            <button type="submit" className="btn-luxury rounded-full px-8">
              Join
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
