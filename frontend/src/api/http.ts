import axios from "axios";
import router from '../router'

// Note: We use localStorage directly for token on response intercept to avoid
// circular dependency on Pinia during setup.

const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3333'

const http = axios.create({
  baseURL: apiBase,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      try {
        router.push('/login')
      } catch (e) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default http;
