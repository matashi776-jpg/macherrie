'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { ...form, redirect: false })
    if (res?.ok) {
      router.push(searchParams.get('callbackUrl') || '/')
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-script text-cherry text-5xl mb-3">Ma Cherrie</div>
          <h1 className="font-playfair text-3xl font-bold text-cream">Welcome Back</h1>
          <p className="text-cream/50 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="glass-dark rounded-3xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cream/70 text-sm mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-cherry/50 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-cream/70 text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-cream placeholder-cream/30 focus:outline-none focus:border-cherry/50 text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cherry hover:bg-cherry/80 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all hover:scale-[1.02]">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-cream/50 text-sm">
              No account?{' '}
              <Link href="/register" className="text-rose-300 hover:text-rose-200 font-medium">Create one</Link>
            </p>
          </div>

          <div className="mt-6 p-3 bg-white/5 rounded-xl text-xs text-cream/40">
            <p className="font-medium text-cream/60 mb-1">Demo accounts:</p>
            <p>admin@macherry.com / admin123</p>
            <p>user@macherry.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-dark" />}><LoginContent /></Suspense>
}
