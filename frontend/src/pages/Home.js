"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getTrendingMovies, getGenres, getMoviesByGenre } from "../redux/slices/movieSlice"
import MovieGrid from "../components/movies/MovieGrid"
import MovieHero from "../components/movies/MovieHero"
import GenreSelector from "../components/movies/GenreSelector"

const Home = () => {
  const dispatch = useDispatch()
  const { trending, genres, moviesByGenre, loading } = useSelector((state) => state.movies)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [featuredMovie, setFeaturedMovie] = useState(null)

  useEffect(() => {
    dispatch(getTrendingMovies())
    dispatch(getGenres())
  }, [dispatch])

  useEffect(() => {
    if (trending.length > 0 && !featuredMovie) {
      // Select a random movie from trending to feature
      const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length))
      setFeaturedMovie(trending[randomIndex])
    }
  }, [trending, featuredMovie])

  useEffect(() => {
    if (selectedGenre) {
      dispatch(getMoviesByGenre(selectedGenre))
    }
  }, [selectedGenre, dispatch])

  const handleSelectGenre = (genreId) => {
    setSelectedGenre(genreId)
  }

  const displayMovies = selectedGenre ? moviesByGenre[selectedGenre] || [] : trending

  return (
    <div className="page-container">
      {featuredMovie && <MovieHero movie={featuredMovie} />}

      {genres.length > 0 && (
        <GenreSelector genres={genres} selectedGenre={selectedGenre} onSelectGenre={handleSelectGenre} />
      )}

      <h2 className="section-title">
        {selectedGenre ? `${genres.find((g) => g.id === selectedGenre)?.name} Movies` : "Trending Movies"}
      </h2>

      <MovieGrid
        movies={displayMovies.map((movie) => ({
          id: movie.id,
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average,
        }))}
        loading={loading}
      />
    </div>
  )
}

export default Home
