import api from "./api"

export const movieService = {
  // Get trending movies
  getTrending: async (page = 1) => {
    try {
      const response = await api.get("/trending/movie/week", {
        params: { page },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      throw error
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: string) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: "videos,credits,similar,recommendations",
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error)
      throw error
    }
  },

  // Search movies
  searchMovies: async (query: string, page = 1) => {
    try {
      const response = await api.get("/search/movie", {
        params: {
          query,
          page,
          include_adult: false,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error searching movies:", error)
      throw error
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page = 1) => {
    try {
      const response = await api.get("/discover/movie", {
        params: {
          with_genres: genreId,
          page,
          sort_by: "popularity.desc",
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error)
      throw error
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await api.get("/genre/movie/list")
      return response.data.genres
    } catch (error) {
      console.error("Error fetching genres:", error)
      throw error
    }
  },

  // Get user's watchlist
  getWatchlist: async (page = 1) => {
    try {
      const response = await api.get("/account/{account_id}/watchlist/movies", {
        params: { page },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      throw error
    }
  },

  // Add movie to watchlist
  addToWatchlist: async (movieId: number) => {
    try {
      const response = await api.post("/account/{account_id}/watchlist", {
        media_type: "movie",
        media_id: movieId,
        watchlist: true,
      })
      return response.data
    } catch (error) {
      console.error(`Error adding movie ${movieId} to watchlist:`, error)
      throw error
    }
  },

  // Remove movie from watchlist
  removeFromWatchlist: async (movieId: number) => {
    try {
      const response = await api.post("/account/{account_id}/watchlist", {
        media_type: "movie",
        media_id: movieId,
        watchlist: false,
      })
      return response.data
    } catch (error) {
      console.error(`Error removing movie ${movieId} from watchlist:`, error)
      throw error
    }
  },

  // Get user's favorite movies
  getFavorites: async (page = 1) => {
    try {
      const response = await api.get("/account/{account_id}/favorite/movies", {
        params: { page },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching favorites:", error)
      throw error
    }
  },

  // Add movie to favorites
  addToFavorites: async (movieId: number) => {
    try {
      const response = await api.post("/account/{account_id}/favorite", {
        media_type: "movie",
        media_id: movieId,
        favorite: true,
      })
      return response.data
    } catch (error) {
      console.error(`Error adding movie ${movieId} to favorites:`, error)
      throw error
    }
  },

  // Remove movie from favorites
  removeFromFavorites: async (movieId: number) => {
    try {
      const response = await api.post("/account/{account_id}/favorite", {
        media_type: "movie",
        media_id: movieId,
        favorite: false,
      })
      return response.data
    } catch (error) {
      console.error(`Error removing movie ${movieId} from favorites:`, error)
      throw error
    }
  },
}
