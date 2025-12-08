import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import { setActivePinia, createPinia } from 'pinia'
import http from '@/api/http'

vi.mock('@/api/http')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with null token and user', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set token and user on successful login', async () => {
    const store = useAuthStore()
    const mockToken = 'test-token-123'
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }

    vi.mocked(http.post).mockResolvedValue({
      data: { token: mockToken, user: mockUser },
    })

    await store.login('test@example.com', 'password123')

    expect(store.token).toBe(mockToken)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should persist token to localStorage on login', async () => {
    const store = useAuthStore()
    const mockToken = 'persisted-token'
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }

    vi.mocked(http.post).mockResolvedValue({
      data: { token: mockToken, user: mockUser },
    })

    await store.login('test@example.com', 'password123')

    expect(localStorage.getItem('token')).toBe(mockToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })

  it('should logout and clear token', async () => {
    const store = useAuthStore()
    const mockToken = 'test-token'
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test' }

    // Set initial state via login
    vi.mocked(http.post).mockResolvedValue({
      data: { token: mockToken, user: mockUser },
    })
    await store.login('test@example.com', 'password123')

    // Now logout
    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should validate token successfully if exists in localStorage', async () => {
    const mockToken = 'valid-token'
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }
    localStorage.setItem('token', mockToken)

    vi.mocked(http.get).mockResolvedValue({
      data: { user: mockUser },
    })

    const store = useAuthStore()
    const result = await store.validateToken()

    expect(result).toBe(true)
    expect(store.token).toBe(mockToken)
    expect(store.user).toEqual(mockUser)
  })

  it('should clear auth on validation failure', async () => {
    const mockToken = 'invalid-token'
    localStorage.setItem('token', mockToken)

    vi.mocked(http.get).mockRejectedValue(new Error('Unauthorized'))

    const store = useAuthStore()
    const result = await store.validateToken()

    expect(result).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })
})
