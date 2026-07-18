import React, { useEffect, useState } from 'react'
import { projects, skillGroups, stats } from './data.js'

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
}

export default function App() {
  const [theme, toggle] = useTheme()
  const year = new Date().getFullYear()

  return (
    <div className="page">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
      </div>

      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">WA</span>
          <span className="brand-name">Waleed Ajmal</span>
        </a>
        <nav className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="theme-btn" onClick={toggle} aria-label="Toggle color theme">
          <Icon path={theme === 'dark' ? ICON.sun : ICON.moon} />
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Full-stack &amp; AI developer</p>
          <h1>
            I build fast, polished web products —
            <span className="grad"> from 3D storefronts to AI apps.</span>
          </h1>
          <p className="lede">
            I'm Waleed Ajmal. I ship end-to-end: designing the interface, wiring the API,
            and folding in AI and real-time 3D where it actually earns its place. Below is a
            selection of things I've built and put online.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#work">
              See my work <Icon path={ICON.arrow} />
            </a>
            <a className="btn btn-ghost" href="https://github.com/waleedsworld" target="_blank" rel="noreferrer">
              <Icon path={ICON.github} /> GitHub
            </a>
          </div>
          <ul className="stat-strip">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <h2>Featured work</h2>
            <p>A curated slice — the rest lives on my GitHub.</p>
          </div>
          <div className="grid">
            {projects.map((p) => (
              <article key={p.name} className={`card accent-${p.accent}`}>
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
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-head">
            <h2>About</h2>
          </div>
          <div className="about-body">
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
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-head">
            <h2>Skills &amp; tools</h2>
          </div>
          <div className="skills-grid">
            {skillGroups.map((g) => (
              <div key={g.title} className="skill-col">
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-card">
            <h2>Let's build something.</h2>
            <p>
              Have a product to ship or an idea worth prototyping? I'm open to freelance and
              collaboration. The fastest way to reach me is GitHub.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="https://github.com/waleedsworld" target="_blank" rel="noreferrer">
                <Icon path={ICON.github} /> github.com/waleedsworld
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {year} Waleed Ajmal</span>
        <span className="footer-note">Designed &amp; built from scratch. No templates.</span>
      </footer>
    </div>
  )
}
