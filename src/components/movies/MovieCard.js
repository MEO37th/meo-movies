"use client"

import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } from "../../store/slices/movieSlice"
import { FaStar, FaHeart, FaRegHeart, FaList, FaRegListAlt } from "react-icons/fa"
import { toast } from "react-toastify"

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { favoriteIds, watchlistIds } = useSelector((state) => state.movies)

  if (!movie || !movie.id) {
    return null
  }

  const isFavorite = favoriteIds.includes(movie.id)
  const isInWatchlist = watchlistIds.includes(movie.id)

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Please login to add movies to favorites")
      return
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id))
    } else {
      dispatch(addToFavorites(movie.id))
    }
  }

  const handleWatchlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Please login to add movies to watchlist")
      return
    }

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id))
    } else {
      dispatch(addToWatchlist(movie.id))
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative">
          <img
            src={posterUrl || "/placeholder.svg"}
            alt={movie.title || "Movie poster"}
            className="w-full h-64 sm:h-80 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=750&width=500"
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>

          {/* Action buttons */}
          {isAuthenticated && (
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full ${
                  isFavorite ? "bg-red-500 text-white" : "bg-black bg-opacity-50 text-white hover:bg-red-500"
                } transition-colors`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </button>
              <button
                onClick={handleWatchlistClick}
                className={`p-2 rounded-full ${
                  isInWatchlist ? "bg-blue-500 text-white" : "bg-black bg-opacity-50 text-white hover:bg-blue-500"
                } transition-colors`}
                title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {isInWatchlist ? <FaList size={16} /> : <FaRegListAlt size={16} />}
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title || "Unknown Title"}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-1" size={14} />
              <span className="text-sm text-gray-400">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
