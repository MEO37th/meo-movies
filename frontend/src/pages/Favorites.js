"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFavorites } from "../redux/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import { Link } from "react-router-dom"
import { FaHeart } from "react-icons/fa"

const Favorites = () => {
  const dispatch = useDispatch()
  const { favorites, loading } = useSelector((state) => state.movies)

  useEffect(() => {
    dispatch(getFavorites())
  }, [dispatch])

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaHeart className="text-red-500 mr-3" /> My Favorites
      </h1>

      <MovieGrid movies={favorites} loading={loading} />

      {!loading && favorites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">You haven't added any movies to your favorites yet.</p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Discover Movies
          </Link>
        </div>
      )}
    </div>
  )
}

export default Favorites
