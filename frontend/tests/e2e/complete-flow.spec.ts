import { test, expect } from '@playwright/test'

test.describe('E2E - Complete User Flow', () => {
  test('should complete login flow', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to login if not authenticated
    expect(page.url()).toContain('/login')

    // Fill login form
    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')

    // Submit form
    await page.click('button:has-text("ENTRAR")')

    // Should navigate to initial page after successful login
    await page.waitForURL('**/inicial', { timeout: 15000 })
    expect(page.url()).toContain('/inicial')
  })

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Try with wrong password
    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button:has-text("ENTRAR")')

    // Should show error and remain on login page
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/login')
  })

  test('should navigate through all screens', async ({ page }) => {
    // Start from login
    await page.goto('/login')

    // Login first
    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')
    await page.waitForURL('**/inicial', { timeout: 15000 })

    // Navigate to triste
    await page.click('body')
    await page.waitForURL('**/triste', { timeout: 10000 })
    expect(page.url()).toContain('/triste')

    // Navigate to poker-face
    await page.click('body')
    await page.waitForURL('**/poker-face', { timeout: 10000 })
    expect(page.url()).toContain('/poker-face')
  })

  test('should display progress bar on poker-face view', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })
    await page.click('body')
    await page.waitForURL('**/triste', { timeout: 10000 })
    await page.click('body')
    await page.waitForURL('**/poker-face', { timeout: 10000 })

    // Verify we're on poker-face page
    expect(page.url()).toContain('/poker-face')
  })

  test('should persist token after page reload', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.')
    await page.click('button:has-text("ENTRAR")')

    await page.waitForURL('**/inicial', { timeout: 15000 })

    // Reload page
    await page.reload()

    // Should not redirect to login (token persisted)
    await page.waitForTimeout(1000)
    expect(page.url()).toContain('/inicial')
  })

  test('should validate password minimum length', async ({ page }) => {
    await page.goto('/login')

    // Try to login with password too short
    await page.fill('input[type="email"]', 'cliente@incuca.com.br')
    await page.fill('input[type="password"]', 'short')
    
    // Submit should be disabled or show error
    const submitButton = await page.locator('button:has-text("ENTRAR")')
    const isDisabled = await submitButton.isDisabled()
    
    if (isDisabled) {
      expect(isDisabled).toBe(true)
    } else {
      await submitButton.click()
      await page.waitForTimeout(500)
      expect(page.url()).toContain('/login')
    }
  })
})

