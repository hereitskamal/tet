'use client'

import { SessionProvider } from 'next-auth/react'
import LenisProvider from './LenisProvider'
import CustomCursor from '@/components/ui/CustomCursor'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LenisProvider>
        <CustomCursor />
        {children}
      </LenisProvider>
    </SessionProvider>
  )
}
