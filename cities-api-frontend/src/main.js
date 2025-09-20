
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import authApi from './api/auth'

import './assets/main.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth on app start
const token = authApi.getToken()
if (token) {
  // Set the authorization header for existing tokens
  import('./api/config').then(({ default: apiConfig }) => {
    apiConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`
  })
}

app.mount('#app')
