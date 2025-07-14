"use client"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchMovieDetails,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  clearMovieDetails,
} from "../store/slices/movieSlice"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { FaStar, FaHeart, FaRegHeart, FaList, FaRegListAlt, FaArrowLeft } from "react-icons/fa"

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { movieDetails, detailsLoading, favoriteIds, watchlistIds } = useSelector((state) => state.movies)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id))
    }

    return () => {
      dispatch(clearMovieDetails())
    }
  }, [dispatch, id])

  if (detailsLoading) {
    return <LoadingSpinner text="Loading movie details..." />
  }

  if (!movieDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Movie Not Found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isFavorite = favoriteIds.includes(movieDetails.id)
  const isInWatchlist = watchlistIds.includes(movieDetails.id)

  const posterUrl = movieDetails.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(movieDetails.id))
    } else {
      dispatch(addToFavorites(movieDetails.id))
    }
  }

  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movieDetails.id))
    } else {
      dispatch(addToWatchlist(movieDetails.id))
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="lg:w-1/3 xl:w-1/4">
            <img
              src={posterUrl || "/placeholder.svg"}
              alt={movieDetails.title}
              className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-2xl"
            />

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleFavoriteClick}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                }`}
              >
                {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>

              <button
                onClick={handleWatchlistClick}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  isInWatchlist
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                }`}
              >
                {isInWatchlist ? <FaList className="mr-2" /> : <FaRegListAlt className="mr-2" />}
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-2/3 xl:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{movieDetails.title}</h1>

            {movieDetails.tagline && <p className="text-xl text-gray-400 italic mb-6">"{movieDetails.tagline}"</p>}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">{movieDetails.vote_average?.toFixed(1) || "N/A"}</span>
              </div>

              {movieDetails.release_date && (
                <span className="text-gray-400">{new Date(movieDetails.release_date).getFullYear()}</span>
              )}

              {movieDetails.runtime && <span className="text-gray-400">{movieDetails.runtime} min</span>}
            </div>

            {/* Genres */}
            {movieDetails.genres && movieDetails.genres.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres.map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movieDetails.overview || "No overview available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
