import { useEffect, useState } from 'react'

// Reads the active landing variant from the URL (`?variant=b`) and keeps the
// query string, <html data-variant> attribute and localStorage in sync so the
// choice survives reloads and can be A/B-tested with a plain link.
const VALID = new Set(['a', 'b'])

function readInitial() {
  if (typeof window === 'undefined') return 'a'
  const q = new URLSearchParams(window.location.search).get('variant')
  if (q && VALID.has(q)) return q
  const saved = localStorage.getItem('variant')
  return saved && VALID.has(saved) ? saved : 'a'
}

export function useVariant() {
  const [variant, setVariantState] = useState(readInitial)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.variant = variant
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('variant', variant)
    }
  }, [variant])

  const setVariant = (next) => {
    const v = VALID.has(next) ? next : 'a'
    setVariantState(v)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (v === 'b') url.searchParams.set('variant', 'b')
      else url.searchParams.delete('variant')
      window.history.replaceState({}, '', url)
    }
  }

  return [variant, setVariant]
}
