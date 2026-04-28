'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-dark flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cherry/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-gold/15 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-champagne/10 rounded-full blur-3xl animate-float-delay2" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,26,74,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(253,248,245,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(253,248,245,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-cherry/20 border border-cherry/40 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-champagne" />
            <span className="text-champagne text-sm font-medium">African & Asian Luxury Beauty</span>
          </div>

          <div className="font-script text-rose-300 text-5xl md:text-7xl mb-4 animate-float">Ma Cherry</div>

          <h1 className="font-playfair text-cream text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            MA space
            <span className="block text-gold-gradient">Cherry</span>
          </h1>

          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Where ancient African and Asian beauty wisdom meets modern luxury. 
            Nourish your skin and hair with ingredients from the world&apos;s most sacred traditions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="group bg-cherry hover:bg-cherry/80 text-white px-8 py-4 rounded-full font-medium transition-all hover:scale-105 flex items-center gap-2 glow-cherry"
            >
              Explore Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/secret-boxes"
              className="group glass border border-champagne/30 text-champagne hover:bg-champagne/10 px-8 py-4 rounded-full font-medium transition-all hover:scale-105 flex items-center gap-2"
            >
              <span className="shimmer">Secret Boxes</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Floating product orbs */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto pb-16">
          {[
            { emoji: '🌸', label: 'Body Care', color: '#8B1A4A' },
            { emoji: '✨', label: 'Hair Care', color: '#7A4F0A' },
            { emoji: '🎁', label: 'Secret Boxes', color: '#5A4A0A' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="glass rounded-2xl p-6 text-center"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <div className="text-cream/70 text-sm font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
