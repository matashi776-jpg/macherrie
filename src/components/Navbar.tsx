'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, Menu, X, User, ChevronDown, Sparkles } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const itemCount = useCartStore(s => s.itemCount())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-white tracking-wider">
              MA <span className="text-rosegold-DEFAULT">✦</span> CHERRIE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/products', label: 'Products' },
              { href: '/secret-boxes', label: 'Secret Boxes' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-rosegold-DEFAULT transition-colors text-sm font-medium tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-white hover:text-rosegold-DEFAULT transition-colors">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cherry-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-rosegold-DEFAULT transition-colors"
                >
                  <User size={22} />
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-medium">{session.user?.name}</p>
                      <p className="text-white/50 text-xs">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
                      <User size={14} /> My Account
                    </Link>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
                      <Sparkles size={14} /> Cherry Points
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-rosegold-DEFAULT hover:text-rosegold-light hover:bg-white/5 text-sm transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false) }}
                      className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm transition-colors border-t border-white/10"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="text-white/80 hover:text-rosegold-DEFAULT transition-colors text-sm font-medium tracking-widest uppercase">
                Sign In
              </Link>
            )}

            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-md border-t border-white/10 px-4 py-6 space-y-4">
          <Link href="/products" onClick={() => setMobileOpen(false)} className="block text-white/80 hover:text-rosegold-DEFAULT py-2 text-sm font-medium tracking-widest uppercase">Products</Link>
          <Link href="/secret-boxes" onClick={() => setMobileOpen(false)} className="block text-white/80 hover:text-rosegold-DEFAULT py-2 text-sm font-medium tracking-widest uppercase">Secret Boxes</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-white/80 hover:text-rosegold-DEFAULT py-2 text-sm font-medium tracking-widest uppercase">My Account</Link>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-rosegold-DEFAULT py-2 text-sm font-medium tracking-widest uppercase">Admin</Link>
              )}
              <button onClick={() => signOut()} className="block text-red-400 py-2 text-sm font-medium tracking-widest uppercase">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block text-white/80 hover:text-rosegold-DEFAULT py-2 text-sm font-medium tracking-widest uppercase">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
