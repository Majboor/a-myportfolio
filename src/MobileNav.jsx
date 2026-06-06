import React, { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

/**
 * Accessible mobile navigation drawer.
 *
 * The desktop nav links are hidden below the tablet breakpoint, so without this
 * component small-screen visitors lose all in-page navigation. This adds a
 * hamburger toggle + slide-in drawer that:
 *  - traps focus while open and restores it on close
 *  - closes on Escape, backdrop tap, or link tap
 *  - locks body scroll while open
 *  - respects prefers-reduced-motion (handled in CSS)
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef(null)
  const toggleRef = useRef(null)

  // Lock background scroll + wire Escape / focus handling while open.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstLink = drawerRef.current?.querySelector('a')
    firstLink?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
      // Return focus to the toggle for keyboard users.
      toggleRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="mobile-nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        className={`mobile-nav-backdrop${open ? ' is-open' : ''}`}
        hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id="mobile-nav-drawer"
        ref={drawerRef}
        className={`mobile-nav-drawer${open ? ' is-open' : ''}`}
        aria-label="Mobile"
        aria-hidden={!open}
        // Keep drawer links out of the tab order when closed.
        {...(open ? {} : { inert: '' })}
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
