"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile } from "../store/slices/authSlice"
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from "react-icons/fa"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const Profile = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const { userFavorites, userWatchlist } = useSelector((state) => state.movies)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = "Username is required"
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      dispatch(updateProfile(formData))
        .unwrap()
        .then(() => {
          setIsEditing(false)
        })
        .catch(() => {
          // Error is handled by the slice
        })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormErrors({})
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
      })
    }
  }

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Profile</h1>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden mb-4 sm:mb-0 sm:mr-6">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaUser size={32} />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <p className="text-red-200">{user.email}</p>
              <p className="text-red-200 text-sm mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{userFavorites?.length || 0}</div>
              <div className="text-gray-400">Favorites</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{userWatchlist?.length || 0}</div>
              <div className="text-gray-400">Watchlist</div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Profile Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.username ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {formErrors.username && <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.email ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com/your-image.jpg"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-2" />
                  <span className="text-white">{user.username}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <span className="text-white">{user.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
