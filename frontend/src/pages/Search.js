"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { searchMovies, clearSearchResults } from "../redux/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import { FaSearch } from "react-icons/fa"

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { searchResults, loading } = useSelector((state) => state.movies)
  const [searchQuery, setSearchQuery] = useState("")

  // Get query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q")
    if (query) {
      setSearchQuery(query)
      dispatch(searchMovies(query))
    } else {
      dispatch(clearSearchResults())
    }

    // Cleanup function
    return () => {
      dispatch(clearSearchResults())
    }
  }, [dispatch, location.search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
    }
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8">Search Movies</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="form-input rounded-r-none flex-grow"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-r-lg flex items-center justify-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <h2 className="section-title">Search Results for "{new URLSearchParams(location.search).get("q")}"</h2>
      )}

      <MovieGrid
        movies={searchResults.map((movie) => ({
          id: movie.id,
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average,
        }))}
        loading={loading}
      />

      {!loading && searchResults.length === 0 && new URLSearchParams(location.search).get("q") && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No movies found matching your search.</p>
          <p className="mt-2 text-gray-500">Try different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  )
}

export default Search
