import { Link } from "react-router-dom"
import { FaPlay, FaStar } from "react-icons/fa"

const MovieHero = ({ movie }) => {
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

  return (
    <div
      className="relative h-96 bg-cover bg-center rounded-lg overflow-hidden mb-8"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 w-full md:w-2/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
        <div className="flex items-center mb-4">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="mr-4">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-300">{movie.release_date?.substring(0, 4)}</span>
        </div>
        <p className="text-gray-300 mb-4 line-clamp-2">{movie.overview}</p>
        <Link
          to={`/movie/${movie.id}`}
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaPlay className="mr-2" /> Watch Trailer
        </Link>
      </div>
    </div>
  )
}

export default MovieHero
