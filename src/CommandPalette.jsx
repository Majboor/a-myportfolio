import React, { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from './data.js'

/*
 * CommandPalette — a keyboard-first launcher for the portfolio (⌘K / Ctrl+K).
 *
 * Lets a visitor instantly:
 *   • jump to any section (Work, About, Skills, Contact)
 *   • search every project by name, tag, tech stack or blurb
 *   • open a project's live site or source, toggle the theme, or open GitHub
 *
 * Fully controlled: parent owns the `open` flag. Handles focus trapping,
 * body-scroll lock, arrow/enter/esc keys, and restores focus on close.
 */

const SECTIONS = [
  { id: 'work', label: 'Featured work', hint: 'Section', keywords: 'projects portfolio' },
  { id: 'about', label: 'About', hint: 'Section', keywords: 'bio who' },
  { id: 'skills', label: 'Skills & tools', hint: 'Section', keywords: 'stack tech' },
  { id: 'contact', label: 'Contact', hint: 'Section', keywords: 'email hire reach' },
]

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function openUrl(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Build the full, static list of commands once.
function buildCommands({ onToggleTheme, theme }) {
  const nav = SECTIONS.map((s) => ({
    id: `nav-${s.id}`,
    group: 'Go to',
    title: s.label,
    subtitle: s.hint,
    search: `${s.label} ${s.keywords}`,
    icon: 'section',
    run: () => scrollToId(s.id),
  }))

  const projectCmds = projects.flatMap((p) => {
    const base = {
      group: 'Projects',
      subtitle: `${p.tag} · ${p.stack.join(', ')}`,
      search: `${p.name} ${p.tag} ${p.stack.join(' ')} ${p.blurb}`,
      accent: p.accent,
      icon: 'project',
    }
    const primary = {
      ...base,
      id: `proj-${p.name}`,
      title: p.name,
      // Prefer the live site; fall back to the repo.
      run: () => openUrl(p.live || p.repo),
      badge: p.live ? 'Live' : 'Code',
    }
    // If a project has both a live site and code, expose the repo separately too.
    if (p.live) {
      return [
        primary,
        {
          ...base,
          id: `proj-${p.name}-code`,
          title: `${p.name} — source`,
          subtitle: 'Open GitHub repository',
          run: () => openUrl(p.repo),
          badge: 'Code',
        },
      ]
    }
    return [primary]
  })

  const actions = [
    {
      id: 'act-theme',
      group: 'Actions',
      title: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      subtitle: 'Toggle appearance',
      search: 'theme dark light toggle appearance mode color',
      icon: 'theme',
      run: onToggleTheme,
      keepOpen: true,
    },
    {
      id: 'act-github',
      group: 'Actions',
      title: 'Open GitHub profile',
      subtitle: 'github.com/waleedsworld',
      search: 'github profile code repos source waleed',
      icon: 'github',
      run: () => openUrl('https://github.com/waleedsworld'),
    },
    {
      id: 'act-top',
      group: 'Actions',
      title: 'Back to top',
      subtitle: 'Scroll to the hero',
      search: 'top home hero scroll up start',
      icon: 'section',
      run: () => scrollToId('top'),
    },
  ]

  return [...nav, ...projectCmds, ...actions]
}

// Lightweight subsequence scorer: every query char must appear in order.
// Rewards contiguous runs and word-start matches so "vn" -> "VoroNova".
function score(query, text) {
  if (!query) return 1
  const q = query.toLowerCase()
  const t = text.toLowerCase()

  // Strongest signal: the query appears as a contiguous substring.
  // A word-boundary hit (e.g. "swift" in "… Swift …") outranks a mid-word one.
  const sub = t.indexOf(q)
  if (sub !== -1) {
    const atBoundary = sub === 0 || /[\s\-·,./]/.test(t[sub - 1])
    return 100 + (atBoundary ? 40 : 0) + q.length + 3 / t.length
  }

  let ti = 0
  let s = 0
  let streak = 0
  let prevWasBoundary = true
  for (let qi = 0; qi < q.length; qi++) {
    const c = q[qi]
    let found = -1
    for (let k = ti; k < t.length; k++) {
      if (t[k] === c) {
        found = k
        break
      }
    }
    if (found === -1) return 0
    const atBoundary = found === 0 || /[\s\-·,./]/.test(t[found - 1])
    s += 1 + streak * 0.6 + (atBoundary ? 1.2 : 0)
    streak = found === ti ? streak + 1 : 0
    prevWasBoundary = atBoundary
    ti = found + 1
  }
  // Shorter targets that fully match rank a little higher.
  return s + 3 / t.length
}

function CmdIcon({ name }) {
  const paths = {
    section: 'M4 6h16M4 12h16M4 18h10',
    project: 'M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4',
    theme: 'M12 3v2M12 19v2M5 12H3M21 12h-2M12 8a4 4 0 100 8 4 4 0 000-8z',
    github:
      'M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.5 1.3a12 12 0 00-6 0C6.5 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  }
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] || paths.section} />
    </svg>
  )
}

export default function CommandPalette({ open, onClose, theme, onToggleTheme }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocusRef = useRef(null)

  const commands = useMemo(
    () => buildCommands({ onToggleTheme, theme }),
    [onToggleTheme, theme],
  )

  // Rank + filter, then keep original group order for a stable layout.
  const results = useMemo(() => {
    const q = query.trim()
    const scored = commands
      .map((c) => ({ c, s: score(q, c.search || c.title) }))
      .filter((x) => x.s > 0)
    if (q) scored.sort((a, b) => b.s - a.s)
    return scored.map((x) => x.c)
  }, [commands, query])

  // Group results in the order groups first appear.
  const groups = useMemo(() => {
    const order = []
    const map = new Map()
    results.forEach((c) => {
      if (!map.has(c.group)) {
        map.set(c.group, [])
        order.push(c.group)
      }
      map.get(c.group).push(c)
    })
    return order.map((g) => ({ group: g, items: map.get(g) }))
  }, [results])

  // Flat list mirrors visual order so arrow keys move predictably.
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  // Reset selection whenever the result set changes.
  useEffect(() => {
    setActive(0)
  }, [query, open])

  // Open/close side effects: focus, scroll lock, focus restore.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      setQuery('')
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // Focus after paint so the input is ready.
      const t = setTimeout(() => inputRef.current?.focus(), 0)
      return () => {
        clearTimeout(t)
        document.body.style.overflow = prevOverflow
      }
    }
  }, [open])

  // Keep the active row scrolled into view.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  const close = () => {
    onClose()
    const el = restoreFocusRef.current
    if (el && typeof el.focus === 'function') setTimeout(() => el.focus(), 0)
  }

  const runIndex = (i) => {
    const cmd = flat[i]
    if (!cmd) return
    cmd.run?.()
    if (!cmd.keepOpen) close()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runIndex(active)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(Math.max(0, flat.length - 1))
    }
  }

  let flatIndex = -1

  return (
    <div className="cmdk-overlay" onMouseDown={close} role="presentation">
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="cmdk-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search projects, sections, actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
            aria-controls="cmdk-list"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="cmdk-esc">esc</kbd>
        </div>

        <div className="cmdk-list" id="cmdk-list" ref={listRef} role="listbox">
          {flat.length === 0 && (
            <div className="cmdk-empty">
              No matches for <strong>“{query}”</strong>
            </div>
          )}
          {groups.map((g) => (
            <div className="cmdk-group" key={g.group}>
              <div className="cmdk-group-label">{g.group}</div>
              {g.items.map((cmd) => {
                flatIndex += 1
                const i = flatIndex
                const isActive = i === active
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    className={`cmdk-item${isActive ? ' is-active' : ''}`}
                    onMouseMove={() => setActive(i)}
                    onClick={() => runIndex(i)}
                  >
                    <span className={`cmdk-ic accent-${cmd.accent || 'blue'}`}>
                      <CmdIcon name={cmd.icon} />
                    </span>
                    <span className="cmdk-text">
                      <span className="cmdk-title">{cmd.title}</span>
                      {cmd.subtitle && <span className="cmdk-sub">{cmd.subtitle}</span>}
                    </span>
                    {cmd.badge && <span className="cmdk-badge">{cmd.badge}</span>}
                    {isActive && <span className="cmdk-enter">↵</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
          <span className="cmdk-count">{flat.length} result{flat.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  )
}
