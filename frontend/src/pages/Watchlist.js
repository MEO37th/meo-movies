"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getWatchlist } from "../redux/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import { Link } from "react-router-dom"
import { FaList } from "react-icons/fa"

const Watchlist = () => {
  const dispatch = useDispatch()
  const { watchlist, loading } = useSelector((state) => state.movies)

  useEffect(() => {
    dispatch(getWatchlist())
  }, [dispatch])

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaList className="text-blue-500 mr-3" /> My Watchlist
      </h1>

      <MovieGrid movies={watchlist} loading={loading} />

      {!loading && watchlist.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">You haven't added any movies to your watchlist yet.</p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Discover Movies
          </Link>
        </div>
      )}
    </div>
  )
}

export default Watchlist
