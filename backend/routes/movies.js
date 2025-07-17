import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Get API key from environment variables
const getTMDBApiKey = () => {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY not configured");
  return key;
};

// Enhanced TMDB request helper with timeout and headers
const tmdbRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: { api_key: getTMDBApiKey() },
      timeout: 5000, // 5-second timeout
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("TMDB API Error:", error.message);
    throw new Error(error.response?.data?.status_message || "TMDB API request failed");
  }
};

// Add CORS headers explicitly to all movie routes
router.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://meo-movies.vercel.app"
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Get trending movies (with error handling)
router.get("/trending", async (req, res) => {
  try {
    const data = await tmdbRequest("/trending/movie/week");
    res.json({ 
      success: true, 
      results: data.results,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1-hour cache
    });
  } catch (error) {
    console.error("Trending movies error:", error);
    res.status(502).json({ 
      message: "Failed to fetch trending movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get movie genres (optimized)
router.get("/genres", async (req, res) => {
  try {
    const data = await tmdbRequest("/genre/movie/list");
    res.json({ 
      success: true, 
      genres: data.genres,
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24-hour cache
    });
  } catch (error) {
    console.error("Genres error:", error);
    res.status(502).json({ 
      message: "Failed to fetch genres",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get movies by genre
router.get("/genre/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbRequest(`/discover/movie?with_genres=${id}`);
    res.json({ 
      success: true, 
      results: data.results,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1-hour cache
    });
  } catch (error) {
    console.error(`Genre ${req.params.id} movies error:`, error);
    res.status(502).json({ 
      message: "Failed to fetch movies by genre",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Search movies
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const data = await tmdbRequest(`/search/movie?query=${encodeURIComponent(query)}`);
    res.json({ 
      success: true, 
      results: data.results,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1-hour cache
    });
  } catch (error) {
    console.error(`Search error for '${req.query.query}':`, error);
    res.status(502).json({ 
      message: "Failed to search movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get movie details
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbRequest(`/movie/${id}?append_to_response=credits,videos,similar`);
    res.json({ 
      success: true, 
      movie: data,
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24-hour cache
    });
  } catch (error) {
    console.error(`Movie details error for ID ${req.params.id}:`, error);
    res.status(502).json({ 
      message: "Failed to fetch movie details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get popular movies
router.get("/popular", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await tmdbRequest(`/movie/popular?page=${page}`);
    res.json({ 
      success: true, 
      results: data.results,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1-hour cache
    });
  } catch (error) {
    console.error("Popular movies error:", error);
    res.status(502).json({ 
      message: "Failed to fetch popular movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await tmdbRequest(`/movie/top_rated?page=${page}`);
    res.json({ 
      success: true, 
      results: data.results,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1-hour cache
    });
  } catch (error) {
    console.error("Top rated movies error:", error);
    res.status(502).json({ 
      message: "Failed to fetch top rated movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;