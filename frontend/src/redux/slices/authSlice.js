import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { setError, clearError } from "./uiSlice"

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"))
const token = localStorage.getItem("token")

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      const response = await api.post("/auth/register", { username, email, password })
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

// Login user
export const login = createAsyncThunk("auth/login", async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.post("/auth/login", { email, password })
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Login failed"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Get user profile
export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get("/users/profile")
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch profile"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Update user profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      const response = await api.put("/users/profile", profileData)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
  loading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      state.token = null
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state) => {
        state.loading = false
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state) => {
        state.loading = false
      })
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem("user", JSON.stringify(action.payload))
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
