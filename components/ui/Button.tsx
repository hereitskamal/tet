'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-black text-[#e5e2e1] hover:bg-[#1a1a1a]',
    outline: 'border border-black text-black bg-transparent hover:bg-black hover:text-[#e5e2e1]',
    ghost: 'text-black bg-transparent hover:bg-[#e2e2e2]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs tracking-[0.05em]',
    md: 'px-6 py-3 text-sm tracking-[0.05em]',
    lg: 'px-8 py-4 text-base tracking-[0.05em]',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {children}
            {icon && <span className="ml-1">{icon}</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
