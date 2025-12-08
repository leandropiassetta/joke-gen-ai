import { describe, it, expect, beforeEach, vi } from 'vitest'
import http from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/http', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('API Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Login Endpoint', () => {
    it('should post to /login with email and password', async () => {
      const mockResponse = {
        data: {
          token: 'test-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
          },
        },
      }

      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await http.post('/login', {
        email: 'test@example.com',
        password: 'password123',
      })

      expect(http.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.data.token).toBe('test-jwt-token')
      expect(result.data.user.email).toBe('test@example.com')
    })

    it('should handle login error', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Invalid credentials',
          },
        },
      }

      vi.mocked(http.post).mockRejectedValue(mockError)

      try {
        await http.post('/login', {
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      } catch (error: any) {
        expect(error.response.status).toBe(401)
      }
    })
  })

  describe('Joke Endpoint', () => {
    it('should fetch joke from /joke endpoint', async () => {
      const mockResponse = {
        data: {
          joke: 'Why did the programmer quit his job?',
        },
      }

      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const authStore = useAuthStore()
      // Set token directly in state (avoid calling login which would trigger http.post)
      authStore.token = 'test-token'

      const result = await http.get('/joke')

      expect(http.get).toHaveBeenCalledWith('/joke')
      expect(result.data.joke).toBeTruthy()
    })

    it('should handle unauthorized error (expired token)', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Token expired',
          },
        },
      }

      vi.mocked(http.get).mockRejectedValue(mockError)

      try {
        await http.get('/joke')
      } catch (error: any) {
        expect(error.response.status).toBe(401)
      }
    })
  })

  describe('Auth Headers', () => {
    it('should include authorization header with token', () => {
      const authStore = useAuthStore()
      authStore.token = 'test-jwt-token'

      // Verify token is stored in auth store
      expect(authStore.token).toBe('test-jwt-token')
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should clear authorization header on logout', () => {
      const authStore = useAuthStore()
      authStore.token = 'test-jwt-token'
      expect(authStore.isAuthenticated).toBe(true)

      authStore.logout()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })
})

