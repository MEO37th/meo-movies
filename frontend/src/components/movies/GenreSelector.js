"use client"

const GenreSelector = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="mb-8">
      <h2 className="section-title">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-full text-sm ${
            !selectedGenre ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedGenre === genre.id ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreSelector
