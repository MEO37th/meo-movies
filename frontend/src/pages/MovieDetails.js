"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  getMovieDetails,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
} from "../redux/slices/movieSlice"
import { toast } from "react-toastify"
import { FaStar, FaHeart, FaRegHeart, FaList, FaRegListAlt, FaArrowLeft } from "react-icons/fa"

const MovieDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { movieDetails, favorites, watchlist, loading } = useSelector((state) => state.movies)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [trailerKey, setTrailerKey] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    dispatch(getMovieDetails(id))

    // Cleanup function
    return () => {
      // Reset movie details when component unmounts
    }
  }, [dispatch, id])

  useEffect(() => {
    if (movieDetails?.videos?.results) {
      const trailer = movieDetails.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
      }
    }
  }, [movieDetails])

  useEffect(() => {
    if (favorites && movieDetails) {
      setIsFavorite(favorites.some((movie) => movie.tmdbId === Number.parseInt(id)))
    }

    if (watchlist && movieDetails) {
      setIsInWatchlist(watchlist.some((movie) => movie.tmdbId === Number.parseInt(id)))
    }
  }, [favorites, watchlist, movieDetails, id])

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to favorites")
      return
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(id))
      toast.success("Removed from favorites")
    } else {
      dispatch(addToFavorites(id))
      toast.success("Added to favorites")
    }
  }

  const handleToggleWatchlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to watchlist")
      return
    }

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(id))
      toast.success("Removed from watchlist")
    } else {
      dispatch(addToWatchlist(id))
      toast.success("Added to watchlist")
    }
  }

  if (loading || !movieDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const backdropUrl = movieDetails.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
    : null

  const posterUrl = movieDetails.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    : "/placeholder-poster.jpg"

  return (
    <div className="bg-gray-900">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={posterUrl || "/placeholder.svg"}
              alt={movieDetails.title}
              className="rounded-lg shadow-lg w-full"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder-poster.jpg"
              }}
            />

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center py-2 px-4 rounded ${
                  isFavorite ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>

              <button
                onClick={handleToggleWatchlist}
                className={`flex items-center justify-center py-2 px-4 rounded ${
                  isInWatchlist ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {isInWatchlist ? <FaList className="mr-2" /> : <FaRegListAlt className="mr-2" />}
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movieDetails.title}</h1>

            {movieDetails.tagline && <p className="text-gray-400 text-lg italic mb-4">{movieDetails.tagline}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span>{movieDetails.vote_average?.toFixed(1)}/10</span>
              </div>

              <span className="text-gray-400">{movieDetails.release_date?.substring(0, 4)}</span>

              <span className="text-gray-400">{movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A"}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300">{movieDetails.overview}</p>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres?.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/?genre=${genre.id}`}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trailer */}
            {trailerKey && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Movie Trailer"
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Cast */}
            {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movieDetails.credits.cast.slice(0, 6).map((person) => (
                    <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                            : "/placeholder-person.jpg"
                        }
                        alt={person.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder-person.jpg"
                        }}
                      />
                      <div className="p-2">
                        <p className="font-semibold truncate">{person.name}</p>
                        <p className="text-gray-400 text-sm truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {movieDetails.similar?.results && movieDetails.similar.results.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Similar Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movieDetails.similar.results.slice(0, 5).map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : "/placeholder-poster.jpg"
                        }
                        alt={movie.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder-poster.jpg"
                        }}
                      />
                      <div className="mt-2">
                        <p className="font-semibold truncate">{movie.title}</p>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1 text-sm" />
                          <span className="text-sm">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
