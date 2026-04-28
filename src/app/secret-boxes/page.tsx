import { prisma } from '@/lib/prisma'
import { SecretBoxCard } from '@/components/SecretBoxCard'
import { Sparkles, Package, Gift, Crown, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Mystery Boxes | Ma Cherrie',
  description: 'Discover our curated luxury mystery boxes with African-Asian hair care products.',
}

export default async function SecretBoxesPage() {
  const boxes = await prisma.secretBox.findMany()

  const faqs = [
    { q: 'When will my Mystery Box ship?', a: 'All Mystery Boxes are shipped within 2-3 business days after your order is confirmed. You\'ll receive a tracking number via email.' },
    { q: 'Can I return a Mystery Box?', a: 'Due to the curated nature of our Mystery Boxes, we cannot accept returns. However, if any product arrives damaged, we\'ll replace it immediately.' },
    { q: 'Are the products full-size?', a: 'Yes! Every item in every tier is a full-size product. We never include samples in our Mystery Boxes.' },
    { q: 'How are products selected?', a: 'Our expert hair care consultants personally select products based on your registered hair profile and the current season\'s offerings.' },
  ]

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-20">
      {/* Hero */}
      <div className="relative bg-black py-28 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cherry-900/20 to-black" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={20} className="text-rosegold-DEFAULT" />
            <span className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase">Curated Luxury</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Mystery<br /><span className="gold-text">Boxes</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Four tiers of curated African-Asian luxury. Every box is a personalized journey, 
            hand-selected by our beauty experts for your unique hair story.
          </p>
        </div>
      </div>

      {/* How it works */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Crown size={32} />, step: '01', title: 'Choose Your Tier', desc: 'Select from Bronze, Silver, Gold, or Diamond — each offering progressively more luxurious curation.' },
              { icon: <Package size={32} />, step: '02', title: 'We Curate for You', desc: 'Our experts hand-select products based on your hair profile, preferences, and current season.' },
              { icon: <Gift size={32} />, step: '03', title: 'Unbox the Magic', desc: 'Receive your luxury box within 2-3 days. Every unboxing is an experience designed to delight.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-cherry-800 flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-rosegold-DEFAULT tracking-widest mb-2">{step.step}</div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boxes grid */}
      <section className="py-24 bg-cream-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold text-gray-900 mb-4">Choose Your Tier</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Hover over each box to reveal what&apos;s inside.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boxes.map(box => (
              <SecretBoxCard key={box.id} box={box} />
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 bg-cherry-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-rosegold-DEFAULT" />
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Our Luxury Guarantee</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Every Mystery Box is curated with the same care we put into our products. If you&apos;re not 
            completely delighted with your box, we&apos;ll make it right — that&apos;s the Ma Cherrie promise.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-white mb-3">Frequently Asked</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-rosegold-DEFAULT/30 transition-colors">
                <h3 className="font-serif text-lg font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
