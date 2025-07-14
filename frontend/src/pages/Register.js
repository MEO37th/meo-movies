"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../redux/slices/authSlice"
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const { error } = useSelector((state) => state.ui)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    const { username, email, password, confirmPassword } = formData

    if (!username) {
      errors.username = "Username is required"
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const { username, email, password } = formData
      dispatch(register({ username, email, password }))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Register</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label flex items-center">
                <FaUser className="mr-2" /> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Choose a username"
              />
              {formErrors.username && <p className="form-error">{formErrors.username}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label flex items-center">
                <FaEnvelope className="mr-2" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
              />
              {formErrors.email && <p className="form-error">{formErrors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label flex items-center">
                <FaLock className="mr-2" /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a password"
              />
              {formErrors.password && <p className="form-error">{formErrors.password}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label flex items-center">
                <FaLock className="mr-2" /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && <p className="form-error">{formErrors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Register
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-red-500 hover:text-red-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
