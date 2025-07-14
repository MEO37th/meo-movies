import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { setError, clearError } from "./uiSlice"

// Get trending movies
export const getTrendingMovies = createAsyncThunk("movies/getTrending", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get("/movies/trending")
    return response.data.results
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch trending movies"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Search movies
export const searchMovies = createAsyncThunk("movies/search", async (query, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get(`/movies/search?query=${query}`)
    return response.data.results
  } catch (error) {
    const message = error.response?.data?.message || "Failed to search movies"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Get movie details
export const getMovieDetails = createAsyncThunk("movies/getDetails", async (id, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get(`/movies/details/${id}`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch movie details"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Get movie genres
export const getGenres = createAsyncThunk("movies/getGenres", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get("/movies/genres")
    return response.data.genres
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch genres"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Get movies by genre
export const getMoviesByGenre = createAsyncThunk(
  "movies/getByGenre",
  async (genreId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      const response = await api.get(`/movies/genre/${genreId}`)
      return {
        genreId,
        movies: response.data.results,
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch movies by genre"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

// Get user favorites
export const getFavorites = createAsyncThunk("movies/getFavorites", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get("/users/favorites")
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch favorites"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Add to favorites
export const addToFavorites = createAsyncThunk(
  "movies/addToFavorites",
  async (movieId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      const response = await api.post(`/movies/favorites/${movieId}`)
      return response.data.movie
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to favorites"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

// Remove from favorites
export const removeFromFavorites = createAsyncThunk(
  "movies/removeFromFavorites",
  async (movieId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      await api.delete(`/movies/favorites/${movieId}`)
      return movieId
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove from favorites"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

// Get user watchlist
export const getWatchlist = createAsyncThunk("movies/getWatchlist", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(clearError())
    const response = await api.get("/users/watchlist")
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch watchlist"
    dispatch(setError(message))
    return rejectWithValue(message)
  }
})

// Add to watchlist
export const addToWatchlist = createAsyncThunk(
  "movies/addToWatchlist",
  async (movieId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      const response = await api.post(`/movies/watchlist/${movieId}`)
      return response.data.movie
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to watchlist"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

// Remove from watchlist
export const removeFromWatchlist = createAsyncThunk(
  "movies/removeFromWatchlist",
  async (movieId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearError())
      await api.delete(`/movies/watchlist/${movieId}`)
      return movieId
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove from watchlist"
      dispatch(setError(message))
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  trending: [],
  searchResults: [],
  movieDetails: null,
  genres: [],
  moviesByGenre: {},
  favorites: [],
  watchlist: [],
  loading: false,
}

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearMovieDetails: (state) => {
      state.movieDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get trending movies
      .addCase(getTrendingMovies.pending, (state) => {
        state.loading = true
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.loading = false
        state.trending = action.payload
      })
      .addCase(getTrendingMovies.rejected, (state) => {
        state.loading = false
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchMovies.rejected, (state) => {
        state.loading = false
      })
      // Get movie details
      .addCase(getMovieDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.loading = false
        state.movieDetails = action.payload
      })
      .addCase(getMovieDetails.rejected, (state) => {
        state.loading = false
      })
      // Get genres
      .addCase(getGenres.pending, (state) => {
        state.loading = true
      })
      .addCase(getGenres.fulfilled, (state, action) => {
        state.loading = false
        state.genres = action.payload
      })
      .addCase(getGenres.rejected, (state) => {
        state.loading = false
      })
      // Get movies by genre
      .addCase(getMoviesByGenre.pending, (state) => {
        state.loading = true
      })
      .addCase(getMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false
        state.moviesByGenre = {
          ...state.moviesByGenre,
          [action.payload.genreId]: action.payload.movies,
        }
      })
      .addCase(getMoviesByGenre.rejected, (state) => {
        state.loading = false
      })
      // Get favorites
      .addCase(getFavorites.pending, (state) => {
        state.loading = true
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.favorites = action.payload
      })
      .addCase(getFavorites.rejected, (state) => {
        state.loading = false
      })
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push(action.payload)
      })
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter((movie) => movie.tmdbId !== Number.parseInt(action.payload))
      })
      // Get watchlist
      .addCase(getWatchlist.pending, (state) => {
        state.loading = true
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.loading = false
        state.watchlist = action.payload
      })
      .addCase(getWatchlist.rejected, (state) => {
        state.loading = false
      })
      // Add to watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist.push(action.payload)
      })
      // Remove from watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter((movie) => movie.tmdbId !== Number.parseInt(action.payload))
      })
  },
})

export const { clearSearchResults, clearMovieDetails } = movieSlice.actions
export default movieSlice.reducer
