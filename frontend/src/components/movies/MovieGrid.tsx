"use client"

import type React from "react"
import { SimpleGrid, Box, Text, Button, Flex } from "@chakra-ui/react"
import MovieCard from "./MovieCard"
import LoadingSpinner from "../ui/LoadingSpinner"

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date?: string
  vote_average: number
  genre_ids?: number[]
}

interface MovieGridProps {
  movies: Movie[]
  loading: boolean
  error: string | null
  genres?: { [id: number]: string }
  favorites?: number[]
  watchlist?: number[]
  hasMore?: boolean
  onLoadMore?: () => void
  emptyMessage?: string
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  error,
  genres,
  favorites = [],
  watchlist = [],
  hasMore = false,
  onLoadMore,
  emptyMessage = "No movies found",
}) => {
  if (loading && movies.length === 0) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <LoadingSpinner />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" p={8} color="red.400">
        <Text fontSize="lg">{error}</Text>
      </Box>
    )
  }

  if (movies.length === 0) {
    return (
      <Box textAlign="center" p={8} color="gray.400">
        <Text fontSize="lg">{emptyMessage}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            genres={genres}
            isFavorite={favorites.includes(movie.id)}
            isWatchlist={watchlist.includes(movie.id)}
          />
        ))}
      </SimpleGrid>

      {hasMore && onLoadMore && (
        <Flex justify="center" mt={8}>
          <Button onClick={onLoadMore} isLoading={loading} variant="cinema" size="md" px={8}>
            Load More
          </Button>
        </Flex>
      )}
    </Box>
  )
}

export default MovieGrid
