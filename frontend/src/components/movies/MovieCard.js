import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"

const MovieCard = ({ movie }) => {
  const posterUrl = movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : "/placeholder-poster.jpg"

  return (
    <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Link to={`/movie/${movie.tmdbId || movie.id}`}>
        <img
          src={posterUrl || "/placeholder.svg"}
          alt={movie.title}
          className="movie-poster w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder-poster.jpg"
          }}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-500 mr-1" />
            <span>{movie.voteAverage || "N/A"}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
