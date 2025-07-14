"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserWatchlist } from "../store/slices/movieSlice"
import { Link } from "react-router-dom"
import { FaList } from "react-icons/fa"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const Watchlist = () => {
  const dispatch = useDispatch()
  const { userWatchlist, loading } = useSelector((state) => state.movies)

  useEffect(() => {
    dispatch(fetchUserWatchlist())
  }, [dispatch])

  if (loading) {
    return <LoadingSpinner text="Loading your watchlist..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <FaList className="text-blue-500 mr-3 text-3xl" />
        <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
      </div>

      {userWatchlist.length === 0 ? (
        <div className="text-center py-12">
          <FaList className="text-gray-600 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-400 mb-4">Your watchlist is empty</h2>
          <p className="text-gray-500 mb-6">Add movies to your watchlist to keep track of what you want to watch.</p>
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {userWatchlist.map((item) => (
            <Link
              key={item.movieId}
              to={`/movie/${item.movieId}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="relative">
                <img
                  src={
                    item.posterPath
                      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                      : "/placeholder.svg?height=750&width=500"
                  }
                  alt={item.title}
                  className="w-full h-64 sm:h-80 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">Added {new Date(item.addedAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
