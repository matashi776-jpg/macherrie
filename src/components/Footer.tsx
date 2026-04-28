import Link from 'next/link'
import { Star, Camera, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-cream/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-script text-4xl text-rose-300 mb-3">Ma Cherry</div>
            <p className="text-cream/50 text-sm leading-relaxed mb-6 max-w-sm">
              Luxury beauty inspired by Africa and Asia. Where ancient wisdom meets modern elegance.
            </p>
            <div className="flex items-center space-x-2 bg-cherry/20 border border-cherry/30 rounded-lg p-3 w-fit">
              <Star className="w-4 h-4 text-champagne" />
              <div>
                <p className="text-champagne text-xs font-semibold">Cherry Points</p>
                <p className="text-cream/50 text-xs">Earn 1 point per $1 spent. 100 pts = $5 off</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-playfair font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-rose-300 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=BODY_CARE" className="hover:text-rose-300 transition-colors">Body Care</Link></li>
              <li><Link href="/products?category=DRY_HAIR" className="hover:text-rose-300 transition-colors">Dry Hair Care</Link></li>
              <li><Link href="/products?category=CURLY_HAIR" className="hover:text-rose-300 transition-colors">Curly Hair</Link></li>
              <li><Link href="/products?category=MASKS" className="hover:text-rose-300 transition-colors">Masks</Link></li>
              <li><Link href="/secret-boxes" className="hover:text-rose-300 transition-colors">Secret Boxes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-playfair font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><Link href="#" className="hover:text-rose-300 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-rose-300 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-rose-300 transition-colors">Contact</Link></li>
              <li><Link href="/dashboard" className="hover:text-rose-300 transition-colors">My Account</Link></li>
            </ul>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-cherry/30 rounded-full flex items-center justify-center hover:bg-cherry transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-cherry/30 rounded-full flex items-center justify-center hover:bg-cherry transition-colors">
                <Heart className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-cherry/30 rounded-full flex items-center justify-center hover:bg-cherry transition-colors">
                <Star className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-cream/40">
          <p>&copy; 2024 MA space Cherry. All rights reserved.</p>
          <p>Made with love for beautiful skin & hair</p>
        </div>
      </div>
    </footer>
  )
}
