'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, Check } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed.')
      setLoading(false)
      return
    }

    const signInResult = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)

    if (signInResult?.ok) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signin')
    }
  }

  const perks = [
    '100 Free Cherry Points on signup',
    'Exclusive member-only offers',
    'Personalized hair care recommendations',
    'Priority shipping on all orders',
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <span className="font-serif text-3xl font-bold text-white">MA <span className="text-rosegold-DEFAULT">✦</span> CHERRIE</span>
          </Link>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Join the Circle</h1>
          <p className="text-white/60">Create your luxury account</p>
        </div>

        {/* Perks */}
        <div className="bg-cherry-800/20 border border-cherry-800/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-rosegold-DEFAULT" />
            <span className="text-white text-sm font-medium">Member Benefits</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {perks.map(perk => (
              <div key={perk} className="flex items-start gap-2 text-xs text-white/70">
                <Check size={12} className="text-rosegold-DEFAULT flex-shrink-0 mt-0.5" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your beautiful name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-rosegold-DEFAULT transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-rosegold-DEFAULT transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-rosegold-DEFAULT transition-colors pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury rounded-full w-full py-4 disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account & Earn Points'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Already a member?{' '}
              <Link href="/auth/signin" className="text-rosegold-DEFAULT hover:text-rosegold-light transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
