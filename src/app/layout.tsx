import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata: Metadata = {
  title: 'MA space Cherrie | Luxury Beauty',
  description: 'African & Asian-inspired luxury cosmetics. Body care, hair care, and secret beauty boxes by Ma Cherrie.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen">
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  )
}
