import express from "express"
import auth from "../middleware/auth.js"
import User from "../models/User.js"

const router = express.Router()

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Failed to fetch profile" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body
    const user = await User.findById(req.user._id)

    // Check if username or email is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } })
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" })
      }
      user.username = username
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } })
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" })
      }
      user.email = email
    }

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture
    }

    await user.save()
    res.json({ success: true, user })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
})

// Get user favorites
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, favorites: user.favorites })
  } catch (error) {
    console.error("Get favorites error:", error)
    res.status(500).json({ message: "Failed to fetch favorites" })
  }
})

// Get user watchlist
router.get("/watchlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, watchlist: user.watchlist })
  } catch (error) {
    console.error("Get watchlist error:", error)
    res.status(500).json({ message: "Failed to fetch watchlist" })
  }
})

export default router
