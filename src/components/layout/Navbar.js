"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import { FaSearch, FaUser, FaHeart, FaList, FaBars, FaTimes, FaSignOutAlt, FaFilm } from "react-icons/fa"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gray-800/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <FaFilm className="text-red-500 text-2xl mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">MovieApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700/80 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700 w-64 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FaSearch />
              </button>
            </form>

            {/* Navigation Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/favorites"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === "/favorites"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <FaHeart className="mr-1" />
                  Favorites
                </Link>
                <Link
                  to="/watchlist"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === "/watchlist"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <FaList className="mr-1" />
                  Watchlist
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === "/profile"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <FaUser className="mr-1" />
                  {user?.username || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-all"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FaSearch />
                </button>
              </form>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHeart className="mr-2" />
                    Favorites
                  </Link>
                  <Link
                    to="/watchlist"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaList className="mr-2" />
                    Watchlist
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
