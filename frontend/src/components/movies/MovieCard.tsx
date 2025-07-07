"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Box, Image, Badge, Text, Flex, IconButton, Tooltip } from "@chakra-ui/react"
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import { movieService } from "../../services/movieService"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    release_date?: string
    vote_average: number
    genre_ids?: number[]
  }
  genres?: { [id: number]: string }
  isFavorite?: boolean
  isWatchlist?: boolean
  onToggleFavorite?: () => void
  onToggleWatchlist?: () => void
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  genres,
  isFavorite = false,
  isWatchlist = false,
  onToggleFavorite,
  onToggleWatchlist,
}) => {
  const { isAuthenticated } = useAuth()
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

  // Handle default toggle functions if not provided
  const handleToggleFavorite =
    onToggleFavorite ||
    (async () => {
      try {
        if (isFavorite) {
          await movieService.removeFromFavorites(movie.id)
        } else {
          await movieService.addToFavorites(movie.id)
        }
      } catch (error) {
        console.error("Error toggling favorite:", error)
      }
    })

  const handleToggleWatchlist =
    onToggleWatchlist ||
    (async () => {
      try {
        if (isWatchlist) {
          await movieService.removeFromWatchlist(movie.id)
        } else {
          await movieService.addToWatchlist(movie.id)
        }
      } catch (error) {
        console.error("Error toggling watchlist:", error)
      }
    })

  return (
    <Box
      className="movie-card"
      borderRadius="lg"
      overflow="hidden"
      bg="dark.100"
      borderWidth="1px"
      borderColor="gray.700"
      position="relative"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Link to={`/movie/${movie.id}`}>
        <Box className="poster-hover" height="300px">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.svg?height=450&width=300"
            }
            alt={movie.title}
            objectFit="cover"
            width="100%"
            height="100%"
            fallbackSrc="/movie-placeholder.jpg"
          />
        </Box>
      </Link>

      {/* Rating badge */}
      <Badge
        position="absolute"
        top="10px"
        right="10px"
        px="2"
        py="1"
        borderRadius="md"
        bg={movie.vote_average >= 7 ? "green.500" : movie.vote_average >= 5 ? "yellow.500" : "red.500"}
        color="white"
        fontSize="sm"
        fontWeight="bold"
      >
        <Flex align="center">
          <FaStar style={{ marginRight: "4px" }} />
          {movie.vote_average.toFixed(1)}
        </Flex>
      </Badge>

      <Box p={4}>
        <Link to={`/movie/${movie.id}`}>
          <Text fontWeight="bold" fontSize="md" noOfLines={1} mb={1} _hover={{ color: "cinema.500" }}>
            {movie.title}
          </Text>
        </Link>

        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.400">
            {releaseYear || "Unknown Year"}
          </Text>

          {isAuthenticated && (
            <Flex>
              <Tooltip label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <IconButton
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                  size="sm"
                  variant="ghost"
                  color={isFavorite ? "cinema.500" : "gray.400"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleToggleFavorite()
                  }}
                  _hover={{ color: "cinema.500" }}
                />
              </Tooltip>
              <Tooltip label={isWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
                <IconButton
                  aria-label={isWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  icon={isWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                  size="sm"
                  variant="ghost"
                  color={isWatchlist ? "gold.400" : "gray.400"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleToggleWatchlist()
                  }}
                  _hover={{ color: "gold.400" }}
                />
              </Tooltip>
            </Flex>
          )}
        </Flex>

        {genres && movie.genre_ids && (
          <Flex mt={2} flexWrap="wrap" gap={1}>
            {movie.genre_ids.slice(0, 2).map(
              (genreId) =>
                genres[genreId] && (
                  <Badge key={genreId} colorScheme="gray" variant="subtle" fontSize="xs">
                    {genres[genreId]}
                  </Badge>
                ),
            )}
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default MovieCard
