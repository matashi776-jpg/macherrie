import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SessionProvider } from '@/components/SessionProvider'
import { Toaster } from '@/components/Toaster'

export const metadata: Metadata = {
  title: 'Ma Cherrie | Luxury African-Asian Hair Care',
  description:
    'Discover the pinnacle of luxury hair care where African heritage meets Asian precision. Ma Cherrie offers premium hair care products crafted with the finest botanicals from both continents.',
  keywords: 'luxury hair care, African cosmetics, Asian beauty, curl care, moisturizing, hair masks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Toaster>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Toaster>
        </SessionProvider>
      </body>
    </html>
  )
}
