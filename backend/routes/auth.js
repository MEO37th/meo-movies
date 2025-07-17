import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register user
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Check if user exists - with case insensitive search for email
    const existingUser = await User.findOne({
      $or: [
        { email: { $regex: new RegExp("^" + email + "$", "i") } },
        { username: { $regex: new RegExp("^" + username + "$", "i") } }
      ],
    })

    if (existingUser) {
      console.log("User already exists:", existingUser.email, existingUser.username);
      return res.status(400).json({
        message: existingUser.email.toLowerCase() === email.toLowerCase() ? 
          "Email already registered" : "Username already taken",
      })
    }

    // Create user
    const user = new User({ 
      username, 
      email: email.toLowerCase(), // Store email in lowercase
      password 
    })
    
    await user.save()
    console.log("User created successfully:", user._id);

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error during registration: " + error.message })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
