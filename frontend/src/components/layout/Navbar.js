"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { FaSearch, FaUser, FaSignOutAlt, FaHeart, FaList, FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-red-500">
            MovieApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                <FaSearch />
              </button>
            </form>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/favorites" className="text-gray-300 hover:text-white flex items-center">
                  <FaHeart className="mr-1" /> Favorites
                </Link>
                <Link to="/watchlist" className="text-gray-300 hover:text-white flex items-center">
                  <FaList className="mr-1" /> Watchlist
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white flex items-center">
                  <FaUser className="mr-1" /> {user?.username}
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white flex items-center">
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                <FaSearch />
              </button>
            </form>

            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/favorites"
                  className="text-gray-300 hover:text-white flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHeart className="mr-2" /> Favorites
                </Link>
                <Link
                  to="/watchlist"
                  className="text-gray-300 hover:text-white flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaList className="mr-2" /> Watchlist
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-2" /> {user?.username}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
