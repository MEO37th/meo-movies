import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { toast } from "react-toastify"

// Enhanced mock data for better demo experience
const mockTrendingMovies = [
  {
    id: 1,
    title: "Spider-Man: No Way Home",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    vote_average: 8.4,
    release_date: "2021-12-15",
    overview:
      "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
  },
  {
    id: 2,
    title: "The Batman",
    poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    vote_average: 7.8,
    release_date: "2022-03-04",
    overview:
      "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family.",
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    vote_average: 8.3,
    release_date: "2022-05-27",
    overview:
      "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs.",
  },
  {
    id: 4,
    title: "Avatar: The Way of Water",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    vote_average: 7.6,
    release_date: "2022-12-16",
    overview:
      "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.",
  },
  {
    id: 5,
    title: "Black Panther: Wakanda Forever",
    poster_path: "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path: "/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    vote_average: 7.3,
    release_date: "2022-11-11",
    overview:
      "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers.",
  },
  {
    id: 6,
    title: "Doctor Strange in the Multiverse of Madness",
    poster_path: "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    backdrop_path: "/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg",
    vote_average: 7.0,
    release_date: "2022-05-06",
    overview:
      "Doctor Strange, with the help of mystical allies both old and new, traverses the mind-bending and dangerous alternate realities.",
  },
]

// Fetch trending movies
export const fetchTrendingMovies = createAsyncThunk("movies/fetchTrending", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/movies/trending")
    return response.data.results || []
  } catch (error) {
    console.log("Using demo data for trending movies")
    return mockTrendingMovies
  }
})

// Fetch popular movies
export const fetchPopularMovies = createAsyncThunk("movies/fetchPopular", async (page = 1, { rejectWithValue }) => {
  try {
    const response = await api.get(`/movies/popular?page=${page}`)
    return response.data
  } catch (error) {
    console.log("Using demo data for popular movies")
    return { results: mockTrendingMovies }
  }
})

// Search movies
export const searchMovies = createAsyncThunk("movies/search", async ({ query, page = 1 }, { rejectWithValue }) => {
  try {
    if (!query || query.trim() === "") {
      return rejectWithValue("Search query is required")
    }

    const response = await api.get(`/movies/search?query=${encodeURIComponent(query.trim())}&page=${page}`)
    return response.data
  } catch (error) {
    console.log("Using demo search results")
    // Return filtered mock data for demo
    const filteredResults = mockTrendingMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()),
    )
    return { results: filteredResults }
  }
})

// Fetch movie details
export const fetchMovieDetails = createAsyncThunk("movies/fetchDetails", async (id, { rejectWithValue }) => {
  try {
    if (!id) {
      return rejectWithValue("Movie ID is required")
    }

    const response = await api.get(`/movies/details/${id}`)
    return response.data.movie
  } catch (error) {
    console.log("Using demo movie details")
    // Return mock movie details
    const mockMovie = mockTrendingMovies.find((m) => m.id === Number.parseInt(id))
    if (mockMovie) {
      return {
        ...mockMovie,
        genres: [
          { id: 1, name: "Action" },
          { id: 2, name: "Adventure" },
          { id: 3, name: "Sci-Fi" },
        ],
        runtime: 148,
        tagline: "With great power comes great responsibility.",
        production_companies: [
          { id: 1, name: "Marvel Studios" },
          { id: 2, name: "Sony Pictures" },
        ],
        budget: 200000000,
        revenue: 1921847111,
        status: "Released",
        original_language: "en",
      }
    }
    return rejectWithValue("Movie not found")
  }
})

// Add to favorites
export const addToFavorites = createAsyncThunk("movies/addToFavorites", async (movieId, { rejectWithValue }) => {
  try {
    await api.post(`/movies/favorites/${movieId}`)
    toast.success("Added to favorites!")
    return Number(movieId)
  } catch (error) {
    // Demo mode - just add to local state
    toast.success("Added to favorites! (Demo mode)")
    return Number(movieId)
  }
})

// Remove from favorites
export const removeFromFavorites = createAsyncThunk(
  "movies/removeFromFavorites",
  async (movieId, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/favorites/${movieId}`)
      toast.success("Removed from favorites!")
      return Number(movieId)
    } catch (error) {
      // Demo mode - just remove from local state
      toast.success("Removed from favorites! (Demo mode)")
      return Number(movieId)
    }
  },
)

// Add to watchlist
export const addToWatchlist = createAsyncThunk("movies/addToWatchlist", async (movieId, { rejectWithValue }) => {
  try {
    await api.post(`/movies/watchlist/${movieId}`)
    toast.success("Added to watchlist!")
    return Number(movieId)
  } catch (error) {
    // Demo mode - just add to local state
    toast.success("Added to watchlist! (Demo mode)")
    return Number(movieId)
  }
})

// Remove from watchlist
export const removeFromWatchlist = createAsyncThunk(
  "movies/removeFromWatchlist",
  async (movieId, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/watchlist/${movieId}`)
      toast.success("Removed from watchlist!")
      return Number(movieId)
    } catch (error) {
      // Demo mode - just remove from local state
      toast.success("Removed from watchlist! (Demo mode)")
      return Number(movieId)
    }
  },
)

// Fetch user favorites
export const fetchUserFavorites = createAsyncThunk("movies/fetchUserFavorites", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users/favorites")
    return response.data.favorites || []
  } catch (error) {
    console.log("Demo mode - no user favorites")
    return []
  }
})

// Fetch user watchlist
export const fetchUserWatchlist = createAsyncThunk("movies/fetchUserWatchlist", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users/watchlist")
    return response.data.watchlist || []
  } catch (error) {
    console.log("Demo mode - no user watchlist")
    return []
  }
})

const initialState = {
  trending: [],
  popular: [],
  searchResults: [],
  movieDetails: null,
  genres: [],
  moviesByGenre: {},
  userFavorites: [],
  userWatchlist: [],
  favoriteIds: JSON.parse(localStorage.getItem("demoFavorites") || "[]"),
  watchlistIds: JSON.parse(localStorage.getItem("demoWatchlist") || "[]"),
  loading: false,
  searchLoading: false,
  detailsLoading: false,
  error: null,
}

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchLoading = false
    },
    clearMovieDetails: (state) => {
      state.movieDetails = null
      state.detailsLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false
        state.trending = action.payload
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.trending = mockTrendingMovies
      })
      // Fetch popular movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false
        state.popular = action.payload.results || []
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.popular = mockTrendingMovies
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.searchLoading = true
        state.error = null
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload.results || []
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchLoading = false
        state.error = action.payload
        state.searchResults = []
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.detailsLoading = true
        state.error = null
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.movieDetails = action.payload
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.detailsLoading = false
        state.error = action.payload
        state.movieDetails = null
      })
      // User favorites
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.userFavorites = action.payload
        state.favoriteIds = action.payload.map((fav) => fav.movieId)
      })
      .addCase(fetchUserFavorites.rejected, (state) => {
        state.userFavorites = []
        // Keep demo favorites from localStorage
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        if (!state.favoriteIds.includes(action.payload)) {
          state.favoriteIds.push(action.payload)
          localStorage.setItem("demoFavorites", JSON.stringify(state.favoriteIds))
        }
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favoriteIds = state.favoriteIds.filter((id) => id !== action.payload)
        state.userFavorites = state.userFavorites.filter((fav) => fav.movieId !== action.payload)
        localStorage.setItem("demoFavorites", JSON.stringify(state.favoriteIds))
      })
      // User watchlist
      .addCase(fetchUserWatchlist.fulfilled, (state, action) => {
        state.userWatchlist = action.payload
        state.watchlistIds = action.payload.map((item) => item.movieId)
      })
      .addCase(fetchUserWatchlist.rejected, (state) => {
        state.userWatchlist = []
        // Keep demo watchlist from localStorage
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        if (!state.watchlistIds.includes(action.payload)) {
          state.watchlistIds.push(action.payload)
          localStorage.setItem("demoWatchlist", JSON.stringify(state.watchlistIds))
        }
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlistIds = state.watchlistIds.filter((id) => id !== action.payload)
        state.userWatchlist = state.userWatchlist.filter((item) => item.movieId !== action.payload)
        localStorage.setItem("demoWatchlist", JSON.stringify(state.watchlistIds))
      })
  },
})

export const { clearSearchResults, clearMovieDetails, clearError } = movieSlice.actions
export default movieSlice.reducer
