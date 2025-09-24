import axios from 'axios'
import router from '@/router'

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      delete apiConfig.defaults.headers.common['Authorization']
      
      if (router.currentRoute.value.name !== 'auth') {
        router.push('/auth')
      }
    }
    return Promise.reject(error)
  }
)

export default apiConfig
