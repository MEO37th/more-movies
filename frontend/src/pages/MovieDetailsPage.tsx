"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Box, Container, Text } from "@chakra-ui/react"
import { movieService } from "../services/movieService"
import MovieDetails from "../components/movies/MovieDetails"
import MovieGrid from "../components/movies/MovieGrid"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [similar, setSimilar] = useState<any[]>([])
  const [genres, setGenres] = useState<{ [id: number]: string }>({})
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchlist, setIsWatchlist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id)
      fetchGenres()
    }
  }, [id])

  const fetchGenres = async () => {
    try {
      const genresData = await movieService.getGenres()
      const genresMap = genresData.reduce((acc: { [id: number]: string }, genre: { id: number; name: string }) => {
        acc[genre.id] = genre.name
        return acc
      }, {})
      setGenres(genresMap)
    } catch (err) {
      console.error("Error fetching genres:", err)
    }
  }

  const fetchMovieDetails = async (movieId: string) => {
    try {
      setLoading(true)
      setError(null)

      const data = await movieService.getMovieDetails(movieId)

      setMovie(data)
      setCredits(data.credits || { cast: [], crew: [] })
      setVideos(data.videos?.results || [])
      setSimilar(data.similar?.results || [])

      // TODO: Check if movie is in user's favorites/watchlist
      // This would typically come from the backend
      setIsFavorite(false)
      setIsWatchlist(false)
    } catch (err: any) {
      console.error("Error fetching movie details:", err)
      setError("Failed to load movie details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!movie) return

    try {
      if (isFavorite) {
        await movieService.removeFromFavorites(movie.id)
        setIsFavorite(false)
      } else {
        await movieService.addToFavorites(movie.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleToggleWatchlist = async () => {
    if (!movie) return

    try {
      if (isWatchlist) {
        await movieService.removeFromWatchlist(movie.id)
        setIsWatchlist(false)
      } else {
        await movieService.addToWatchlist(movie.id)
        setIsWatchlist(true)
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    }
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="dark.300" py={8}>
        <Container maxW="container.xl">
          <LoadingSpinner text="Loading movie details..." />
        </Container>
      </Box>
    )
  }

  if (error || !movie) {
    return (
      <Box minH="100vh" bg="dark.300" py={8}>
        <Container maxW="container.xl">
          <Text color="red.400" textAlign="center" fontSize="lg">
            {error || "Movie not found"}
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="dark.300">
      <Container maxW="container.xl" py={8}>
        <MovieDetails
          movie={movie}
          credits={credits}
          videos={videos}
          similar={{ results: similar }}
          isFavorite={isFavorite}
          isWatchlist={isWatchlist}
          onToggleFavorite={handleToggleFavorite}
          onToggleWatchlist={handleToggleWatchlist}
        />

        {/* Similar Movies */}
        {similar.length > 0 && (
          <Box mt={12}>
            <Text fontSize="2xl" fontWeight="bold" color="white" mb={6}>
              Similar Movies
            </Text>
            <MovieGrid
              movies={similar.slice(0, 10)}
              loading={false}
              error={null}
              genres={genres}
              emptyMessage="No similar movies found"
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default MovieDetailsPage
