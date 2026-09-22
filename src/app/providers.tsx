'use client'
import { Toaster } from 'sonner'
import { ScrollToTop } from '@/components/shop/ScrollToTop'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTop />
      <Toaster position="top-center" dir="rtl" richColors />
    </>
  )
}
