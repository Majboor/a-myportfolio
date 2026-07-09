import { describe, it, expect } from 'vitest'
import { projects, skillGroups, stats } from '../../src/data.js'

// The portfolio content is data-driven, so these tests guard the shape and
// integrity of that data — a broken link or missing field would silently ship
// otherwise.

const isHttpsUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

describe('projects data', () => {
  it('exposes a non-empty list', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('gives every project the required fields', () => {
    for (const p of projects) {
      expect(p.name, `name for ${JSON.stringify(p)}`).toBeTruthy()
      expect(p.tag, `tag for ${p.name}`).toBeTruthy()
      expect(p.blurb, `blurb for ${p.name}`).toBeTruthy()
      expect(p.accent, `accent for ${p.name}`).toBeTruthy()
      expect(Array.isArray(p.stack)).toBe(true)
      expect(p.stack.length, `stack for ${p.name}`).toBeGreaterThan(0)
    }
  })

  it('points every repo/live link at a valid https URL', () => {
    for (const p of projects) {
      expect(isHttpsUrl(p.repo), `repo for ${p.name}`).toBe(true)
      if (p.live) {
        expect(isHttpsUrl(p.live), `live for ${p.name}`).toBe(true)
      }
    }
  })

  it('uses unique project names', () => {
    const names = projects.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('only uses accents backed by a CSS class', () => {
    // Keep in sync with the accent-* rules in src/styles.css.
    const allowed = new Set([
      'ember', 'violet', 'blue', 'teal', 'pink', 'green', 'amber', 'slate',
    ])
    for (const p of projects) {
      expect(allowed.has(p.accent), `unknown accent "${p.accent}" on ${p.name}`).toBe(true)
    }
  })
})

describe('skillGroups data', () => {
  it('has titled groups each with at least one item', () => {
    expect(skillGroups.length).toBeGreaterThan(0)
    for (const g of skillGroups) {
      expect(g.title).toBeTruthy()
      expect(Array.isArray(g.items)).toBe(true)
      expect(g.items.length).toBeGreaterThan(0)
    }
  })
})

describe('stats data', () => {
  it('has a value and label for each stat', () => {
    expect(stats.length).toBeGreaterThan(0)
    for (const s of stats) {
      expect(s.value).toBeTruthy()
      expect(s.label).toBeTruthy()
    }
  })
})
