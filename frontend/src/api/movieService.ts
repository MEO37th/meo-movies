// frontend/src/api/movieService.ts
// Use process.env for compatibility or direct string access
const API_BASE_URL = "https://meo-movies.onrender.com/api/movies";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  // Add other TMDB properties as needed
}

interface ApiResponse {
  success: boolean;
  results?: Movie[];
  message?: string;
  expiresAt?: string;
}

const handleRequest = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // For auth cookies if needed
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData: { message?: string } = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error instanceof Error ? error : new Error('Network request failed');
  }
};

export const getPopularMovies = async (page = 1): Promise<Movie[]> => {
  const data = await handleRequest<ApiResponse>(`/popular?page=${page}`);
  return data.results || [];
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const data = await handleRequest<ApiResponse>('/trending');
  return data.results || [];
};

export const getTopRatedMovies = async (page = 1): Promise<Movie[]> => {
  const data = await handleRequest<ApiResponse>(`/top-rated?page=${page}`);
  return data.results || [];
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  const data = await handleRequest<ApiResponse>(`/search?query=${encodeURIComponent(query)}&page=${page}`);
  return data.results || [];
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const data = await handleRequest<{ success: boolean; movie: Movie }>(`/details/${id}`);
  if (!data.movie) throw new Error('Movie not found');
  return data.movie;
};

export const getMovieGenres = async (): Promise<{ id: number; name: string }[]> => {
  const data = await handleRequest<{ success: boolean; genres: { id: number; name: string }[] }>('/genres');
  return data.genres || [];
};