'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'something went wrong.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/')
  }

  return (
    <div className="pt-28 pb-24 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-4">create account</p>
          <h1 className="text-heading-xl lowercase tracking-tight mb-12">register.</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="your name"
                className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors placeholder:text-[#c6c6c6]"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[#ba1a1a] lowercase"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
            >
              {loading ? 'creating account...' : (
                <>create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-sm text-[#777777] mt-8 lowercase">
            already have an account?{' '}
            <Link href="/login" className="text-black underline underline-offset-4 hover:no-underline">
              sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
