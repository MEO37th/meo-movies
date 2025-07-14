// frontend/src/api/movieService.ts

const API_BASE_URL = "http://localhost:5000/api/movies"; // Your backend base route

export const getPopularMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/popular`);
  const data = await response.json();
  return data.results;
};

export const getTrendingMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/trending`);
  const data = await response.json();
  return data.results;
};

export const getTopRatedMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/top-rated`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.results;
};
