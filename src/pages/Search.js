"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { searchMovies, clearSearchResults } from "../store/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import { FaSearch } from "react-icons/fa"

const Search = () => {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { searchResults, searchLoading, error } = useSelector((state) => state.movies)

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchQuery = urlParams.get("q")

    if (searchQuery && searchQuery.trim()) {
      setQuery(searchQuery)
      setHasSearched(true)
      dispatch(searchMovies({ query: searchQuery }))
    } else {
      setHasSearched(false)
      dispatch(clearSearchResults())
    }

    return () => {
      if (!searchQuery) {
        dispatch(clearSearchResults())
      }
    }
  }, [location.search, dispatch])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      const trimmedQuery = query.trim()

      if (trimmedQuery) {
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      } else {
        navigate("/search")
        dispatch(clearSearchResults())
        setHasSearched(false)
      }
    },
    [query, navigate, dispatch],
  )

  const currentQuery = new URLSearchParams(location.search).get("q")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Movies</h1>
        <p className="text-gray-400 mb-8">Find your favorite movies and discover new ones</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-4 py-3 pr-12 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-2 rounded-lg transition-colors"
            >
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FaSearch />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {currentQuery && hasSearched && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Search results for "{currentQuery}"</h2>
          {!searchLoading && searchResults.length > 0 && (
            <p className="text-gray-400 mt-1">
              Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      <MovieGrid
        movies={searchResults}
        loading={searchLoading}
        error={error}
        emptyMessage={
          hasSearched && currentQuery
            ? `No movies found for "${currentQuery}". Try different keywords.`
            : "Enter a search term to find movies."
        }
      />
    </div>
  )
}

export default Search
