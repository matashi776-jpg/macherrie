'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cherry-900/30 to-black" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B1A4A 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              left: `${10 + i * 13}%`,
              top: `${15 + i * 12}%`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, #C9956C, transparent)'
                : 'radial-gradient(circle, #8B1A4A, transparent)',
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Main 3D Cherry Orb */}
      <motion.div
        className="absolute right-10 md:right-24 top-1/2 -translate-y-1/2 hidden md:block"
        animate={{ y: [0, -25, 0], rotateY: [0, 15, 0], rotateX: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="w-80 h-80 rounded-full relative"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #C9956C, #8B1A4A 40%, #4A0D2A 80%, #1a0010)',
            boxShadow: '0 0 80px rgba(139,26,74,0.6), 0 0 40px rgba(201,149,108,0.4), inset -20px -20px 40px rgba(0,0,0,0.5), inset 10px 10px 30px rgba(201,149,108,0.2)',
          }}
        >
          {/* Shine highlight */}
          <div
            className="absolute top-8 left-10 w-16 h-16 rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)' }}
          />
          {/* Cherry stems */}
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-3 h-16 rounded-full"
            style={{ background: 'linear-gradient(180deg, #2D5016, #4A8022)', transformOrigin: 'bottom center', transform: 'rotate(-10deg)' }}
          />
          <div
            className="absolute -top-10 left-1/2 translate-x-2 w-3 h-14 rounded-full"
            style={{ background: 'linear-gradient(180deg, #2D5016, #4A8022)', transformOrigin: 'bottom center', transform: 'rotate(15deg)' }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="shimmer absolute inset-0 opacity-30" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles size={16} className="text-rosegold-DEFAULT" />
            <span className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase">
              African × Asian Luxury
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-6xl md:text-8xl font-bold text-white leading-none mb-6"
          >
            Where
            <br />
            <span className="gold-text">Heritage</span>
            <br />
            Meets
            <br />
            <span className="italic text-cherry-300">Luxury</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg"
          >
            Discover the sacred rituals of African botanicals and Asian precision,
            fused into hair care that transforms, not just conditions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/products" className="btn-luxury flex items-center gap-2 rounded-full">
              Shop Collection <ArrowRight size={16} />
            </Link>
            <Link
              href="/secret-boxes"
              className="text-white border border-white/20 hover:border-rosegold-DEFAULT hover:text-rosegold-DEFAULT px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all"
            >
              Mystery Boxes
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-rosegold-DEFAULT rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
