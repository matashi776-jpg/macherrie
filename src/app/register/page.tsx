'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    if (res.ok) {
      router.push('/login?registered=true')
    } else {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-script text-cherry text-5xl mb-3">Ma Cherrie</div>
          <h1 className="font-playfair text-3xl font-bold text-cream">Create Account</h1>
          <p className="text-cream/50 mt-2 text-sm">Join the Ma Cherrie community</p>
        </div>

        <div className="glass-dark rounded-3xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            ] as const).map(field => (
              <div key={field.key}>
                <label className="block text-cream/70 text-sm mb-1">{field.label}</label>
                <input
                  type={field.type}
                  required
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-cherry/50 text-sm"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="block text-cream/70 text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-cream placeholder-cream/30 focus:outline-none focus:border-cherry/50 text-sm"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-cream/70 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-cherry/50 text-sm"
                placeholder="Repeat password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cherry hover:bg-cherry/80 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all hover:scale-[1.02]">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-cream/50 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-rose-300 hover:text-rose-200 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
