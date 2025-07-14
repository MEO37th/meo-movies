"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../redux/slices/authSlice"
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    const { email, password } = formData

    if (!email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid"
    }

    if (!password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      dispatch(login(formData))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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

            <div className="mb-6">
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
                placeholder="Enter your password"
              />
              {formErrors.password && <p className="form-error">{formErrors.password}</p>}
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" /> Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 hover:text-red-400">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
