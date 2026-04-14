'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const [value, setValue] = useState(searchParams.get('q') || '')
  const didUserType = useRef(false)

  useEffect(() => {
    if (!didUserType.current) return
    const current = new URLSearchParams(searchParams.toString())
    if (value) {
      current.set('q', value)
    } else {
      current.delete('q')
    }
    current.delete('page')
    const timer = setTimeout(() => {
      router.push(pathname + '?' + current.toString())
    }, 350)
    return () => clearTimeout(timer)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => {
    didUserType.current = true
    setValue('')
    setIsExpanded(false)
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="flex items-center gap-2 overflow-hidden"
        animate={{ width: isExpanded ? 240 : 36 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 p-2 hover:bg-[#e2e2e2] rounded-full transition-colors"
          aria-label="Toggle search"
        >
          <Search className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="flex items-center gap-1 flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => { didUserType.current = true; setValue(e.target.value) }}
                placeholder="search objects..."
                className="flex-1 min-w-0 bg-transparent text-sm lowercase placeholder:text-[#c6c6c6] outline-none border-b border-[#c6c6c6] focus:border-black pb-0.5 transition-colors"
              />
              {value && (
                <button onClick={clear} className="flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-[#777777]" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
