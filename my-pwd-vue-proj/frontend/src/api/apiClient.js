import axios from 'axios'
import { logoutUser, refreshAuthToken } from './auth.js'

class ApiClient {
  constructor() { 
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true, // send cookies with every request
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    this.refreshPromise = null
    this.setupInterceptors()
  }

  setupInterceptors() {
    // NO Authorization header added here (we use cookies)

    // Response interceptor for handling expired tokens
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
    
        // Do not retry for login or refresh routes
        if (
          originalRequest.url.includes('/auth/admin/login') ||
          originalRequest.url.includes('/auth/admin/refresh') ||
          originalRequest.url.includes('/auth/employee/login') || 
          originalRequest.url.includes('/auth/employee/refresh')   
        ) {
          return Promise.reject(error);
        }
        
    
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
    
          try {
            await this.handleTokenRefresh();
            return this.instance(originalRequest);
          } catch (refreshError) {
            logoutUser();
            return Promise.reject(refreshError);
          }
        }
    
        return Promise.reject(error);
      }
    );    
  }

  async handleTokenRefresh() {
    if (!this.refreshPromise) {
      this.refreshPromise = refreshAuthToken()
        .finally(() => {
          this.refreshPromise = null
        })
    }
    return this.refreshPromise
  }

  getInstance() {
    return this.instance
  }
}

export const apiClient = new ApiClient().getInstance()
