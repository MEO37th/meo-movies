import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import movieReducer from "./slices/movieSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export default store
