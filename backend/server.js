import dotenv from "dotenv"
// Load environment variables FIRST
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import movieRoutes from "./routes/movies.js"
import userRoutes from "./routes/users.js"


const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "https://meo-movies.onrender.com"],
    credentials: true,
  }),
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Movie App API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
