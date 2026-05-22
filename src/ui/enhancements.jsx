import React, { useEffect, useRef, useState, useCallback } from 'react'
import './enhance.css'

/* --------------------------------------------------------------------------
 * Reduced-motion helper — every animated affordance respects the OS setting.
 * ------------------------------------------------------------------------ */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* --------------------------------------------------------------------------
 * ScrollProgress — thin gradient bar tracking read position.
 * ------------------------------------------------------------------------ */
export function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={ref} />
    </div>
  )
}

/* --------------------------------------------------------------------------
 * Reveal — staggered fade/slide-in as elements enter the viewport.
 * ------------------------------------------------------------------------ */
export function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* --------------------------------------------------------------------------
 * SpotlightCard — project card with an accent glow that follows the cursor
 * plus a subtle 3D tilt. Falls back to a static card under reduced motion.
 * ------------------------------------------------------------------------ */
export function SpotlightCard({ className = '', children, delay = 0, ...rest }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.unobserve(e.target)
        }
      },
      { threshold: 0.14 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const onMove = useCallback(
    (e) => {
      if (reduced) return
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
      const rx = ((y / r.height) - 0.5) * -4
      const ry = ((x / r.width) - 0.5) * 4
      el.style.setProperty('--rx', `${rx}deg`)
      el.style.setProperty('--ry', `${ry}deg`)
    },
    [reduced]
  )
  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      <span className="spotlight-glow" aria-hidden="true" />
      {children}
    </article>
  )
}

/* --------------------------------------------------------------------------
 * useScrollSpy — returns the id of the section currently in view.
 * ------------------------------------------------------------------------ */
export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY + offset
        let current = ids[0]
        for (const s of sections) {
          if (s.offsetTop <= y) current = s.id
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids, offset])
  return active
}

/* --------------------------------------------------------------------------
 * BackToTop — appears after scrolling, glides back to the top.
 * ------------------------------------------------------------------------ */
export function BackToTop() {
  const [show, setShow] = useState(false)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'is-visible' : ''}`}
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
      }
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
