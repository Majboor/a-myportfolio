import { test, expect } from '@playwright/test'

// Smoke / e2e coverage of the core visitor flows against the production build.

test('loads with the correct title and hero', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Waleed Ajmal/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('renders the featured work grid', async ({ page }) => {
  await page.goto('/')
  const cards = page.locator('#work .card')
  await expect(cards.first()).toBeVisible()
  // The portfolio ships with a curated set of projects; guard against an empty grid.
  expect(await cards.count()).toBeGreaterThanOrEqual(5)
})

test('in-page nav scrolls to each section', async ({ page }) => {
  await page.goto('/')
  for (const [label, id] of [
    ['Work', 'work'],
    ['About', 'about'],
    ['Skills', 'skills'],
    ['Contact', 'contact'],
  ]) {
    await page.getByRole('navigation').getByRole('link', { name: label }).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
})

test('theme toggle flips and persists across reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  // With colorScheme pinned to dark, the app defaults to the dark theme.
  await expect(html).toHaveAttribute('data-theme', 'dark')

  await page.getByRole('button', { name: /toggle color theme/i }).click()
  await expect(html).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
})

test('external links are safe and point to real hosts', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('a[href^="http"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const link = links.nth(i)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noreferrer/)
  }
})

test('has no console errors on load', async ({ page }) => {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})
