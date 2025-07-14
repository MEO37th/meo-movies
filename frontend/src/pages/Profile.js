"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, updateProfile } from "../redux/slices/authSlice"
import { toast } from "react-toastify"
import { FaUser, FaEnvelope, FaCamera, FaSave } from "react-icons/fa"

const Profile = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

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
    const { username, email } = formData

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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      dispatch(updateProfile(formData))
        .unwrap()
        .then(() => {
          toast.success("Profile updated successfully")
          setIsEditing(false)
        })
        .catch(() => {
          toast.error("Failed to update profile")
        })
    }
  }

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-gray-700 overflow-hidden mb-4">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture || "/placeholder.svg"}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <FaUser size={64} />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="w-full">
                <label htmlFor="profilePicture" className="form-label flex items-center justify-center">
                  <FaCamera className="mr-2" /> Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter image URL"
                />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="md:w-2/3">
            {isEditing ? (
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
                  />
                  {formErrors.username && <p className="form-error">{formErrors.username}</p>}
                </div>

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
                  />
                  {formErrors.email && <p className="form-error">{formErrors.email}</p>}
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form data to user data
                      if (user) {
                        setFormData({
                          username: user.username || "",
                          email: user.email || "",
                          profilePicture: user.profilePicture || "",
                        })
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-400">Username</h2>
                  <p className="text-xl">{user?.username}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-400">Email</h2>
                  <p className="text-xl">{user?.email}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-400">Member Since</h2>
                  <p className="text-xl">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>

                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
