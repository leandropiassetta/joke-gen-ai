import { test, expect } from '@playwright/test'

test.describe('E2E - Responsiveness', () => {
  test('should work on mobile viewport (390px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    expect(page.url()).toContain('/login')

    // Login elements should be visible
    const emailInput = await page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })

    // Fill and submit
    await emailInput.fill('cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })

    // Initial page loaded successfully
    expect(page.url()).toContain('/inicial')
  })

  test('should work on tablet viewport (768px)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/')
    expect(page.url()).toContain('/login')

    const emailInput = await page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })

    await emailInput.fill('cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })

    // Page loaded successfully
    expect(page.url()).toContain('/inicial')
  })

  test('should work on desktop viewport (1920px)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto('/')
    expect(page.url()).toContain('/login')

    const emailInput = await page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })

    await emailInput.fill('cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })

    // Page loaded successfully
    expect(page.url()).toContain('/inicial')
  })

  test('poker-face view should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/login')
    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })
    
    // Click to navigate to triste
    await page.click('body')
    await page.waitForURL('**/triste', { timeout: 10000 })
    
    // Click to navigate to poker-face
    await page.click('body')
    await page.waitForURL('**/poker-face', { timeout: 10000 })

    // Poker-face view is displayed
    expect(page.url()).toContain('/poker-face')
  })
})
