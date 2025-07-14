import mongoose from "mongoose"

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  posterPath: {
    type: String,
  },
  backdropPath: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  voteAverage: {
    type: Number,
  },
  genres: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Movie = mongoose.model("Movie", movieSchema)

export default Movie
