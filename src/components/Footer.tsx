import Link from 'next/link'
import { AtSign, Share2, Globe, ExternalLink, Sparkles, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-bold text-white tracking-wider">
                MA <span className="text-rosegold-DEFAULT">✦</span> CHERRIE
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Where African heritage meets Asian precision. Luxury hair care crafted for the modern queen.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <AtSign size={18} />, href: '#', label: 'Instagram' },
                { icon: <Share2 size={18} />, href: '#', label: 'Twitter' },
                { icon: <Globe size={18} />, href: '#', label: 'Facebook' },
                { icon: <ExternalLink size={18} />, href: '#', label: 'YouTube' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-rosegold-DEFAULT hover:border-rosegold-DEFAULT transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-rosegold-DEFAULT">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Dry Hair Care', href: '/products?subcategory=dry-hair' },
                { label: 'Curly Hair Care', href: '/products?subcategory=curly-hair' },
                { label: 'Hair Masks', href: '/products?subcategory=masks' },
                { label: 'Shampoos', href: '/products?subcategory=shampoos' },
                { label: 'Conditioners', href: '/products?subcategory=conditioners' },
                { label: 'Mystery Boxes', href: '/secret-boxes' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-rosegold-DEFAULT">Account</h3>
            <ul className="space-y-3">
              {[
                { label: 'My Account', href: '/dashboard' },
                { label: 'Order History', href: '/dashboard' },
                { label: 'Cherry Points', href: '/dashboard' },
                { label: 'Sign In', href: '/auth/signin' },
                { label: 'Register', href: '/auth/register' },
                { label: 'Shopping Cart', href: '/cart' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-rosegold-DEFAULT">Stay Connected</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={15} className="text-rosegold-DEFAULT flex-shrink-0" />
                <span>hello@macherrie.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={15} className="text-rosegold-DEFAULT flex-shrink-0" />
                <span>+1 (888) MA-CHERRIE</span>
              </div>
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={15} className="text-rosegold-DEFAULT flex-shrink-0 mt-0.5" />
                <span>Luxury HQ, New York, NY</span>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-3 uppercase tracking-wider">Newsletter</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-rosegold-DEFAULT"
                />
                <button
                  type="submit"
                  className="bg-rosegold-DEFAULT hover:bg-rosegold-dark text-white rounded-full px-4 py-2 text-sm transition-colors"
                >
                  <Sparkles size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Ma Cherrie Cosmetics. All rights reserved. Crafted with love for queens everywhere.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy', 'Returns'].map(item => (
              <Link key={item} href="#" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
