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
  res.header("Access-Control-Allow-Origin", "https://meo-movies.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
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

// ... (keep your existing routes for /popular, /top-rated, etc.)

export default router;