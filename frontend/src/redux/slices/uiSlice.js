import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  error: null,
  notification: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    },
  },
})

export const { setError, clearError, setNotification, clearNotification } = uiSlice.actions
export default uiSlice.reducer
