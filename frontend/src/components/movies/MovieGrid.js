import MovieCard from "./MovieCard"

const MovieGrid = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No movies found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id || movie.tmdbId} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid
