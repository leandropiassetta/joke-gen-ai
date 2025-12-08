import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock router configuration
const routes = [
  {
    path: '/login',
    name: 'login',
    component: { template: '<div>Login</div>' },
  },
  {
    path: '/inicial',
    name: 'inicial',
    component: { template: '<div>Initial</div>' },
    meta: { requiresAuth: true },
  },
  {
    path: '/triste',
    name: 'triste',
    component: { template: '<div>Sad</div>' },
    meta: { requiresAuth: true },
  },
  {
    path: '/poker-face',
    name: 'poker-face',
    component: { template: '<div>Poker Face</div>' },
    meta: { requiresAuth: true },
  },
  {
    path: '/feliz',
    name: 'feliz',
    component: { template: '<div>Happy</div>' },
    meta: { requiresAuth: true },
  },
]

describe('Router Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should allow access to /login without authentication', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    // Add beforeEach guard
    router.beforeEach((to, _from, next) => {
      const authStore = useAuthStore()
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })

    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should redirect unauthenticated users to /login', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.beforeEach((to, _from, next) => {
      const authStore = useAuthStore()
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })

    const authStore = useAuthStore()
    expect(authStore.isAuthenticated).toBe(false)

    // Try to access protected route
    await router.push('/inicial')

    // Should redirect to login
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow authenticated users to access protected routes', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.beforeEach((to, _from, next) => {
      const authStore = useAuthStore()
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })

    const authStore = useAuthStore()
    authStore.token = 'test-token'
    authStore.user = { id: 1, email: 'test@example.com', name: 'Test User' }

    expect(authStore.isAuthenticated).toBe(true)

    await router.push('/inicial')
    expect(router.currentRoute.value.path).toBe('/inicial')
  })

  it('should prevent access to protected route after logout', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.beforeEach((to, _from, next) => {
      const authStore = useAuthStore()
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })

    const authStore = useAuthStore()
    authStore.token = 'test-token'

    await router.push('/inicial')
    expect(router.currentRoute.value.path).toBe('/inicial')

    authStore.logout()
    expect(authStore.isAuthenticated).toBe(false)

    await router.push('/poker-face')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow navigation between protected routes when authenticated', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.beforeEach((to, _from, next) => {
      const authStore = useAuthStore()
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })

    const authStore = useAuthStore()
    authStore.token = 'test-token'

    await router.push('/inicial')
    expect(router.currentRoute.value.path).toBe('/inicial')

    await router.push('/triste')
    expect(router.currentRoute.value.path).toBe('/triste')

    await router.push('/poker-face')
    expect(router.currentRoute.value.path).toBe('/poker-face')

    await router.push('/feliz')
    expect(router.currentRoute.value.path).toBe('/feliz')
  })
})

