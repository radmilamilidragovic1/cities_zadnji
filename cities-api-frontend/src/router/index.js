import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AuthPages from '@/pages/AuthPages.vue'
import Cities from '@/components/Cities.vue'
import authApi from '@/api/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPages,
    },
    {
      path: '/cities',
      name: 'cities',
      component: Cities,
    }
  ]
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = authApi.isAuthenticated()
  
  // If trying to access auth page while already logged in, redirect to home
  if (to.name === 'auth' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router



