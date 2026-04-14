'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError('invalid email or password.')
      setLoading(false)
    } else {
      router.push(redirect)
    }
  }

  return (
    <div className="pt-28 pb-24 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-4">welcome back</p>
          <h1 className="text-heading-xl lowercase tracking-tight mb-12">sign in.</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors placeholder:text-[#c6c6c6]"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              {loading ? 'signing in...' : (
                <>sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-sm text-[#777777] mt-8 lowercase">
            no account?{' '}
            <Link href="/register" className="text-black underline underline-offset-4 hover:no-underline">
              register
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-[#e2e2e2]">
            <p className="text-xs text-[#777777] lowercase mb-2">demo credentials:</p>
            <p className="text-xs text-[#777777]">user@tht.com / user123</p>
            <p className="text-xs text-[#777777]">admin@tht.com / admin123</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
