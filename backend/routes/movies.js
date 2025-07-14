import express from "express"
import axios from "axios"
import auth from "../middleware/auth.js"
import User from "../models/User.js"

const router = express.Router()
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Get API key directly from process.env each time
const getTMDBApiKey = () => process.env.TMDB_API_KEY

// Helper function to make TMDB API calls
const tmdbRequest = async (endpoint) => {
  try {
    const apiKey = getTMDBApiKey()
    if (!apiKey) {
      throw new Error("TMDB API key not found")
    }
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: { api_key: apiKey },
    })
    return response.data
  } catch (error) {
    console.error("TMDB API Error:", error.response?.data || error.message)
    throw new Error("Failed to fetch data from TMDB")
  }
}

// Get trending movies
router.get("/trending", async (req, res) => {
  try {
    const data = await tmdbRequest("/trending/movie/week")
    res.json({ success: true, results: data.results })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get popular movies
router.get("/popular", async (req, res) => {
  try {
    const page = req.query.page || 1
    const data = await tmdbRequest(`/movie/popular?page=${page}`)
    res.json({ success: true, ...data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const page = req.query.page || 1
    const data = await tmdbRequest(`/movie/top_rated?page=${page}`)
    res.json({ success: true, ...data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Search movies
router.get("/search", async (req, res) => {
  try {
    const { query, page = 1 } = req.query

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" })
    }

    const data = await tmdbRequest(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
    res.json({ success: true, ...data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get movie details
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await tmdbRequest(`/movie/${id}?append_to_response=credits,videos,similar,reviews`)
    res.json({ success: true, movie: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get movie genres
router.get("/genres", async (req, res) => {
  try {
    const data = await tmdbRequest("/genre/movie/list")
    res.json({ success: true, genres: data.genres })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get movies by genre
router.get("/genre/:id", async (req, res) => {
  try {
    const { id } = req.params
    const page = req.query.page || 1
    const data = await tmdbRequest(`/discover/movie?with_genres=${id}&page=${page}`)
    res.json({ success: true, ...data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add to favorites
router.post("/favorites/:id", auth, async (req, res) => {
  try {
    const movieId = Number.parseInt(req.params.id)
    const user = await User.findById(req.user._id)

    // Check if already in favorites
    const existingFavorite = user.favorites.find((fav) => fav.movieId === movieId)
    if (existingFavorite) {
      return res.status(400).json({ message: "Movie already in favorites" })
    }

    // Get movie details from TMDB
    const movieData = await tmdbRequest(`/movie/${movieId}`)

    // Add to favorites
    user.favorites.push({
      movieId: movieData.id,
      title: movieData.title,
      posterPath: movieData.poster_path,
    })

    await user.save()
    res.json({ success: true, message: "Movie added to favorites" })
  } catch (error) {
    console.error("Add to favorites error:", error)
    res.status(500).json({ message: "Failed to add to favorites" })
  }
})

// Remove from favorites
router.delete("/favorites/:id", auth, async (req, res) => {
  try {
    const movieId = Number.parseInt(req.params.id)
    const user = await User.findById(req.user._id)

    user.favorites = user.favorites.filter((fav) => fav.movieId !== movieId)
    await user.save()

    res.json({ success: true, message: "Movie removed from favorites" })
  } catch (error) {
    console.error("Remove from favorites error:", error)
    res.status(500).json({ message: "Failed to remove from favorites" })
  }
})

// Add to watchlist
router.post("/watchlist/:id", auth, async (req, res) => {
  try {
    const movieId = Number.parseInt(req.params.id)
    const user = await User.findById(req.user._id)

    // Check if already in watchlist
    const existingWatchlist = user.watchlist.find((item) => item.movieId === movieId)
    if (existingWatchlist) {
      return res.status(400).json({ message: "Movie already in watchlist" })
    }

    // Get movie details from TMDB
    const movieData = await tmdbRequest(`/movie/${movieId}`)

    // Add to watchlist
    user.watchlist.push({
      movieId: movieData.id,
      title: movieData.title,
      posterPath: movieData.poster_path,
    })

    await user.save()
    res.json({ success: true, message: "Movie added to watchlist" })
  } catch (error) {
    console.error("Add to watchlist error:", error)
    res.status(500).json({ message: "Failed to add to watchlist" })
  }
})

// Remove from watchlist
router.delete("/watchlist/:id", auth, async (req, res) => {
  try {
    const movieId = Number.parseInt(req.params.id)
    const user = await User.findById(req.user._id)

    user.watchlist = user.watchlist.filter((item) => item.movieId !== movieId)
    await user.save()

    res.json({ success: true, message: "Movie removed from watchlist" })
  } catch (error) {
    console.error("Remove from watchlist error:", error)
    res.status(500).json({ message: "Failed to remove from watchlist" })
  }
})

export default router
