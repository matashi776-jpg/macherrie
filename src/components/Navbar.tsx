'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, User, Menu, X, Star } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (session) {
      fetch('/api/cart').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setCartCount(data.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0))
      }).catch(() => {})
    }
  }, [session])

  const role = (session?.user as { role?: string })?.role
  const points = (session?.user as { cherryPoints?: number })?.cherryPoints

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-script text-3xl text-rose-300 hover:text-champagne transition-colors">
            Ma Cherry
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-cream/80 hover:text-rose-300 transition-colors text-sm font-medium">Home</Link>
            <Link href="/products" className="text-cream/80 hover:text-rose-300 transition-colors text-sm font-medium">Products</Link>
            <Link href="/secret-boxes" className="text-cream/80 hover:text-rose-300 transition-colors text-sm font-medium">Secret Boxes</Link>
            {role === 'ADMIN' && (
              <Link href="/admin" className="text-champagne hover:text-yellow-300 transition-colors text-sm font-medium">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session && points !== undefined && (
              <div className="hidden md:flex items-center space-x-1 bg-cherry/20 border border-cherry/30 rounded-full px-3 py-1">
                <Star className="w-3 h-3 text-champagne" />
                <span className="text-champagne text-xs font-medium">{points} pts</span>
              </div>
            )}

            <Link href="/cart" className="relative text-cream/80 hover:text-rose-300 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cherry text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard" className="text-cream/80 hover:text-rose-300 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={() => signOut()} className="text-cream/60 hover:text-rose-300 text-sm transition-colors hidden md:block">Sign Out</button>
              </div>
            ) : (
              <Link href="/login" className="bg-cherry hover:bg-cherry/80 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                Sign In
              </Link>
            )}

            <button className="md:hidden text-cream" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-cream/80 hover:text-rose-300" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/products" className="block text-cream/80 hover:text-rose-300" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/secret-boxes" className="block text-cream/80 hover:text-rose-300" onClick={() => setMenuOpen(false)}>Secret Boxes</Link>
            {role === 'ADMIN' && <Link href="/admin" className="block text-champagne" onClick={() => setMenuOpen(false)}>Admin</Link>}
            {session ? (
              <>
                <Link href="/dashboard" className="block text-cream/80 hover:text-rose-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { signOut(); setMenuOpen(false) }} className="block text-cream/60 hover:text-rose-300">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="block text-cherry hover:text-rose-300" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
