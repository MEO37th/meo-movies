import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import movieReducer from "./slices/movieSlice"
import uiReducer from "./slices/uiSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    ui: uiReducer,
  },
})

export default store
