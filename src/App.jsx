import React, { useEffect, useMemo, useState } from 'react'
import { projects, skillGroups, stats } from './data.js'
import CommandPalette from './CommandPalette.jsx'
import MobileNav from './MobileNav.jsx'
import Hero from './Hero.jsx'
import { useVariant } from './useVariant.js'
import './hero-b.css'
import {
  ScrollProgress,
  BackToTop,
  Reveal,
  SpotlightCard,
  useScrollSpy,
} from './ui/enhancements.jsx'

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const ICON = {
  sun: 'M12 3v2M12 19v2M5 12H3M21 12h-2M6 6L5 5M18 18l1 1M18 6l1-1M6 18l-1 1M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
  github: 'M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.5 1.3a12 12 0 00-6 0C6.5 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  arrow: 'M7 17L17 7M17 7H8M17 7v9',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3',
}

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function App() {
  const [theme, toggle] = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [variant, setVariant] = useVariant()
  const year = new Date().getFullYear()
  const navIds = useMemo(() => NAV.map((n) => n.id), [])
  const active = useScrollSpy(navIds)

  // Global ⌘K / Ctrl+K opens the command palette; also supports "/" to search.
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }
      const tag = (e.target?.tagName || '').toLowerCase()
      const typing = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable
      if (k === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="page">
      <a className="skip-link" href="#top">Skip to content</a>
      <ScrollProgress />
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">WA</span>
          <span className="brand-name">Waleed Ajmal</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? 'is-active' : ''}
              aria-current={active === n.id ? 'true' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          className="cmdk-trigger"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette to search"
        >
          <Icon path={ICON.search} />
          <span className="cmdk-trigger-label">Search</span>
          <kbd className="cmdk-trigger-kbd">⌘K</kbd>
        </button>
        <button className="theme-btn" onClick={toggle} aria-label="Toggle color theme">
          <Icon path={theme === 'dark' ? ICON.sun : ICON.moon} />
        </button>
        <MobileNav />
      </header>

      <main id="top" tabIndex={-1} aria-label="Main content">
        <Hero
          variant={variant}
          setVariant={setVariant}
          stats={stats}
          Icon={Icon}
          ICON={ICON}
        />

        <section id="work" className="section" aria-labelledby="work-title">
          <Reveal className="section-head">
            <h2 id="work-title">Featured work</h2>
            <p>A curated slice — the rest lives on my GitHub.</p>
          </Reveal>
          <div className="grid">
            {projects.map((p, i) => (
              <SpotlightCard
                key={p.name}
                className={`card accent-${p.accent}`}
                delay={(i % 3) * 90}
              >
                <div className="card-top">
                  <span className="card-tag">{p.tag}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="card-blurb">{p.blurb}</p>
                <ul className="chips">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="card-links">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="link-live">
                      Live site <Icon path={ICON.arrow} />
                    </a>
                  )}
                  <a href={p.repo} target="_blank" rel="noreferrer" className="link-repo">
                    <Icon path={ICON.github} /> Code
                  </a>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section id="about" className="section about" aria-labelledby="about-title">
          <Reveal className="section-head">
            <h2 id="about-title">About</h2>
          </Reveal>
          <Reveal className="about-body" delay={80}>
            <p>
              I'm a full-stack engineer who likes shipping. Most of my work starts as a rough
              idea and ends as something you can open in a browser — a storefront, a dashboard,
              a small tool, a playful experiment. I care about the details that make software
              feel considered: fast loads, honest interfaces, and interactions that respond the
              way you expect.
            </p>
            <p>
              Lately a lot of that involves AI and real-time 3D: receipt analyzers and vision
              apps built on LLMs, luxury storefronts with interactive product models, and
              walkable worlds reconstructed from ordinary phone footage with Gaussian splatting.
              I move comfortably across the stack — React and TypeScript on the front, Python,
              Flask, FastAPI and Node on the back, deployed on Cloudflare and AWS.
            </p>
          </Reveal>
        </section>

        <section id="skills" className="section" aria-labelledby="skills-title">
          <Reveal className="section-head">
            <h2 id="skills-title">Skills &amp; tools</h2>
          </Reveal>
          <div className="skills-grid">
            {skillGroups.map((g, i) => (
              <Reveal key={g.title} className="skill-col" delay={i * 80}>
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <Reveal className="contact-card">
            <h2 id="contact-title">Let's build something.</h2>
            <p>
              Have a product to ship or an idea worth prototyping? I'm open to freelance and
              collaboration. The fastest way to reach me is GitHub.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="https://github.com/waleedsworld" target="_blank" rel="noreferrer">
                <Icon path={ICON.github} /> github.com/waleedsworld
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <BackToTop />

      <footer className="footer">
        <span>© {year} Waleed Ajmal</span>
        <span className="footer-note">Designed &amp; built from scratch. No templates.</span>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggle}
      />
    </div>
  )
}
