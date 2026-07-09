import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App.jsx'
import { projects, skillGroups, stats } from '../../src/data.js'

describe('App structure', () => {
  it('renders the hero heading and brand', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getAllByText('Waleed Ajmal').length).toBeGreaterThan(0)
  })

  it('renders all primary sections', () => {
    const { container } = render(<App />)
    for (const id of ['work', 'about', 'skills', 'contact']) {
      expect(container.querySelector(`#${id}`), `section #${id}`).toBeInTheDocument()
    }
  })

  it('renders a nav link for each in-page section', () => {
    render(<App />)
    const nav = screen.getByRole('navigation')
    for (const label of ['Work', 'About', 'Skills', 'Contact']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('renders a card for every project with its links', () => {
    const { container } = render(<App />)
    const cards = container.querySelectorAll('#work .card')
    expect(cards.length).toBe(projects.length)

    for (const p of projects) {
      const heading = screen.getByRole('heading', { level: 3, name: p.name })
      expect(heading).toBeInTheDocument()
      const card = heading.closest('.card')
      const repoLink = within(card).getByRole('link', { name: /code/i })
      expect(repoLink).toHaveAttribute('href', p.repo)
      expect(repoLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
      if (p.live) {
        const liveLink = within(card).getByRole('link', { name: /live site/i })
        expect(liveLink).toHaveAttribute('href', p.live)
      }
    }
  })

  it('renders each skill group and its items', () => {
    render(<App />)
    for (const g of skillGroups) {
      const heading = screen.getByRole('heading', { level: 3, name: g.title })
      expect(heading).toBeInTheDocument()
      const col = heading.closest('.skill-col')
      for (const item of g.items) {
        expect(within(col).getByText(item)).toBeInTheDocument()
      }
    }
  })

  it('renders the stat strip values', () => {
    const { container } = render(<App />)
    const strip = container.querySelector('.stat-strip')
    expect(strip).toBeInTheDocument()
    for (const s of stats) {
      // Some stat values (e.g. "Full-stack") also appear in prose, so scope the
      // lookup to the stat strip itself.
      expect(within(strip).getByText(s.value)).toBeInTheDocument()
      expect(within(strip).getByText(s.label)).toBeInTheDocument()
    }
  })

  it('shows the current year in the footer', () => {
    render(<App />)
    const year = String(new Date().getFullYear())
    expect(screen.getByText(new RegExp(`©\\s*${year}`))).toBeInTheDocument()
  })

  it('opens external links safely in a new tab', () => {
    render(<App />)
    const external = screen
      .getAllByRole('link')
      .filter((a) => (a.getAttribute('href') || '').startsWith('http'))
    expect(external.length).toBeGreaterThan(0)
    for (const a of external) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a.getAttribute('rel') || '').toContain('noreferrer')
    }
  })
})

describe('theme toggle', () => {
  it('defaults to dark and persists the choice', () => {
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('flips the theme when the toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const btn = screen.getByRole('button', { name: /toggle color theme/i })

    await user.click(btn)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')

    await user.click(btn)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('respects a previously saved theme', () => {
    localStorage.setItem('theme', 'light')
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
