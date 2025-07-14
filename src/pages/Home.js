"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchUserFavorites,
  fetchUserWatchlist,
} from "../store/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { FaPlay, FaSearch, FaHeart, FaList } from "react-icons/fa"

const Home = () => {
  const dispatch = useDispatch()
  const { trending, popular, loading, error } = useSelector((state) => state.movies)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchTrendingMovies())
    dispatch(fetchPopularMovies())

    // Fetch user data if authenticated
    if (isAuthenticated) {
      dispatch(fetchUserFavorites())
      dispatch(fetchUserWatchlist())
    }
  }, [dispatch, isAuthenticated])

  if (loading && trending.length === 0 && popular.length === 0) {
    return <LoadingSpinner text="Loading movies..." />
  }

  const featuredMovie = trending[0]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-screen">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Discover Amazing <span className="text-red-500">Movies</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore trending movies, create your watchlist, and never miss a great film again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  <FaPlay className="mr-2" />
                  Watch Now
                </Link>
                <Link
                  to="/search"
                  className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors border border-gray-600"
                >
                  <FaSearch className="mr-2" />
                  Browse Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Quick Actions for Authenticated Users */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link
              to="/favorites"
              className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 group"
            >
              <div className="flex items-center">
                <FaHeart className="text-3xl mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">My Favorites</h3>
                  <p className="text-red-100">View your favorite movies</p>
                </div>
              </div>
            </Link>

            <Link
              to="/watchlist"
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group"
            >
              <div className="flex items-center">
                <FaList className="text-3xl mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">My Watchlist</h3>
                  <p className="text-blue-100">Movies to watch later</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Trending Movies */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">🔥 Trending Now</h2>
            <Link to="/search" className="text-red-500 hover:text-red-400 font-medium">
              View All
            </Link>
          </div>
          <MovieGrid
            movies={trending}
            loading={loading && trending.length === 0}
            emptyMessage="No trending movies available at the moment."
          />
        </section>

        {/* Popular Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">⭐ Popular Movies</h2>
            <Link to="/search" className="text-red-500 hover:text-red-400 font-medium">
              View All
            </Link>
          </div>
          <MovieGrid
            movies={popular}
            loading={loading && popular.length === 0}
            emptyMessage="No popular movies available at the moment."
          />
        </section>
      </div>
    </div>
  )
}

export default Home
