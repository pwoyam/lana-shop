'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-brand-700 text-white shadow-lg hover:bg-brand-800 transition animate-in fade-in slide-in-from-bottom-4"
      aria-label="بازگشت به بالا"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
