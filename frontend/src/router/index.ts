import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useHumorStore } from '../stores/humor'
import LoginView from '../views/LoginView.vue'
import InitialView from '../views/InitialView.vue'
import SadView from '../views/SadView.vue'
import PokerFaceView from '../views/PokerFaceView.vue'
import HappyView from '../views/HappyView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    meta: { public: true }
  },
  { 
    path: '/inicial', 
    name: 'inicial', 
    component: InitialView,
    meta: { public: false }
  },
  { 
    path: '/triste', 
    name: 'triste', 
    component: SadView,
    meta: { public: false }
  },
  { 
    path: '/poker-face', 
    name: 'poker-face', 
    component: PokerFaceView,
    meta: { public: false }
  },
  { 
    path: '/feliz', 
    name: 'feliz', 
    component: HappyView,
    meta: { public: false }
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/login' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  const humorStore = useHumorStore()

  // If the route is public (e.g., /login)
  if (to.meta.public) {
    // If already authenticated, don't force login — redirect to /inicial
    if (authStore.isAuthenticated) {
      return next('/inicial')
    }
    return next()
  }
  // If the route is not public, verify authentication
  if (!authStore.isAuthenticated) {
    return next('/login')
  }
  // When arriving at /inicial, reset the humor progress
  if (to.path === '/inicial') {
    humorStore.resetProgress()
  }

  next()
})

export default router
