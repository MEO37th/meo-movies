import axios from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)

    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection.")
    } else if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login"
        toast.error("Session expired. Please login again.")
      }
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.")
    } else if (!error.response) {
      console.log("Network error - using demo mode")
      // Don't show error for network issues in demo mode
    }

    return Promise.reject(error)
  },
)

export default api
