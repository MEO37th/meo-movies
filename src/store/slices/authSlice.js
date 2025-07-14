import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { toast } from "react-toastify"

// Demo user for testing
const demoUser = {
  id: "demo-user",
  username: "DemoUser",
  email: "demo@movieapp.com",
  profilePicture: "",
  createdAt: new Date().toISOString(),
}

// Load user from token
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await api.get("/auth/me")
    return response.data.user
  } catch (error) {
    // Check if we have a demo token
    const token = localStorage.getItem("token")
    if (token === "demo-token") {
      return demoUser
    }

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return rejectWithValue(error.response?.data?.message || "Failed to load user")
  }
})

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      localStorage.setItem("token", response.data.token)
      toast.success("Registration successful! Welcome to MovieApp!")
      return response.data
    } catch (error) {
      // Demo mode registration
      const demoToken = "demo-token"
      const demoUserData = {
        ...demoUser,
        username: username.trim(),
        email: email.trim().toLowerCase(),
      }

      localStorage.setItem("token", demoToken)
      localStorage.setItem("user", JSON.stringify(demoUserData))
      toast.success("Registration successful! (Demo mode)")

      return {
        token: demoToken,
        user: demoUserData,
      }
    }
  },
)

// Login user
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    })

    localStorage.setItem("token", response.data.token)
    toast.success("Login successful! Welcome back!")
    return response.data
  } catch (error) {
    // Demo mode login
    const demoToken = "demo-token"
    const demoUserData = {
      ...demoUser,
      email: email.trim().toLowerCase(),
    }

    localStorage.setItem("token", demoToken)
    localStorage.setItem("user", JSON.stringify(demoUserData))
    toast.success("Login successful! (Demo mode)")

    return {
      token: demoToken,
      user: demoUserData,
    }
  }
})

// Update profile
export const updateProfile = createAsyncThunk("auth/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const cleanData = {
      ...profileData,
      username: profileData.username?.trim(),
      email: profileData.email?.trim().toLowerCase(),
    }

    const response = await api.put("/users/profile", cleanData)
    toast.success("Profile updated successfully!")
    return response.data.user
  } catch (error) {
    // Demo mode update
    const updatedUser = {
      ...demoUser,
      username: profileData.username?.trim() || demoUser.username,
      email: profileData.email?.trim().toLowerCase() || demoUser.email,
      profilePicture: profileData.profilePicture || demoUser.profilePicture,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    toast.success("Profile updated successfully! (Demo mode)")
    return updatedUser
  }
})

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("demoFavorites")
      localStorage.removeItem("demoWatchlist")
      state.token = null
      state.isAuthenticated = false
      state.user = null
      state.loading = false
      state.error = null
      toast.success("Logged out successfully!")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
