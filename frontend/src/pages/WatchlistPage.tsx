"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Container, Heading, Text, VStack, HStack, Button, Select } from "@chakra-ui/react"
import { movieService } from "../services/movieService"
import MovieGrid from "../components/movies/MovieGrid"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { FaBookmark, FaHeart } from "react-icons/fa"

const WatchlistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">("watchlist")
  const [movies, setMovies] = useState<any[]>([])
  const [genres, setGenres] = useState<{ [id: number]: string }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState("added_at.desc")

  useEffect(() => {
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

    fetchGenres()
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [activeTab, currentPage, sortBy])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      let data
      if (activeTab === "watchlist") {
        data = await movieService.getWatchlist(currentPage)
      } else {
        data = await movieService.getFavorites(currentPage)
      }

      if (currentPage === 1) {
        setMovies(data.results || [])
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])])
      }

      setTotalPages(data.total_pages || 0)
    } catch (err: any) {
      console.error(`Error fetching ${activeTab}:`, err)
      setError(`Failed to load your ${activeTab}. Please try again.`)
      // For demo purposes, set empty array if API fails
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: "watchlist" | "favorites") => {
    setActiveTab(tab)
    setCurrentPage(1)
    setMovies([])
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1)
    setMovies([])
  }

  const handleToggleFavorite = async (movieId: number) => {
    try {
      const isFavorite = movies.some((movie) => movie.id === movieId)
      if (isFavorite) {
        await movieService.removeFromFavorites(movieId)
      } else {
        await movieService.addToFavorites(movieId)
      }
      // Refresh the list
      setCurrentPage(1)
      fetchMovies()
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleToggleWatchlist = async (movieId: number) => {
    try {
      const isInWatchlist = movies.some((movie) => movie.id === movieId)
      if (isInWatchlist) {
        await movieService.removeFromWatchlist(movieId)
      } else {
        await movieService.addToWatchlist(movieId)
      }
      // Refresh the list
      setCurrentPage(1)
      fetchMovies()
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    }
  }

  return (
    <Box minH="100vh" bg="dark.300" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color="white">
              My Collection
            </Heading>
            <Text color="gray.400">Manage your favorite movies and watchlist</Text>
          </VStack>

          {/* Tabs and Controls */}
          <Box bg="dark.100" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            <VStack spacing={6}>
              {/* Tab Buttons */}
              <HStack spacing={4} w="full" justify="center">
                <Button
                  leftIcon={<FaBookmark />}
                  onClick={() => handleTabChange("watchlist")}
                  variant={activeTab === "watchlist" ? "cinema" : "outline"}
                  colorScheme={activeTab === "watchlist" ? "red" : "gray"}
                  size="lg"
                >
                  Watchlist ({movies.length})
                </Button>
                <Button
                  leftIcon={<FaHeart />}
                  onClick={() => handleTabChange("favorites")}
                  variant={activeTab === "favorites" ? "cinema" : "outline"}
                  colorScheme={activeTab === "favorites" ? "red" : "gray"}
                  size="lg"
                >
                  Favorites ({movies.length})
                </Button>
              </HStack>

              {/* Sort Controls */}
              {movies.length > 0 && (
                <HStack justify="space-between" w="full">
                  <Text color="white" fontSize="sm">
                    {movies.length} movie{movies.length !== 1 ? "s" : ""} in your {activeTab}
                  </Text>
                  <HStack>
                    <Text color="white" fontSize="sm">
                      Sort by:
                    </Text>
                    <Select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      bg="dark.200"
                      color="white"
                      borderColor="gray.600"
                      size="sm"
                      maxW="200px"
                    >
                      <option value="added_at.desc">Recently Added</option>
                      <option value="added_at.asc">Oldest First</option>
                      <option value="title.asc">Title A-Z</option>
                      <option value="title.desc">Title Z-A</option>
                      <option value="release_date.desc">Newest Movies</option>
                      <option value="release_date.asc">Oldest Movies</option>
                      <option value="vote_average.desc">Highest Rated</option>
                    </Select>
                  </HStack>
                </HStack>
              )}
            </VStack>
          </Box>

          {/* Movies Grid */}
          <Box>
            {loading && movies.length === 0 ? (
              <LoadingSpinner text={`Loading your ${activeTab}...`} />
            ) : (
              <MovieGrid
                movies={movies}
                loading={loading}
                error={error}
                genres={genres}
                favorites={activeTab === "favorites" ? movies.map((m) => m.id) : []}
                watchlist={activeTab === "watchlist" ? movies.map((m) => m.id) : []}
                hasMore={currentPage < totalPages}
                onLoadMore={handleLoadMore}
                emptyMessage={
                  activeTab === "watchlist"
                    ? "Your watchlist is empty. Start adding movies you want to watch!"
                    : "You haven't favorited any movies yet. Start building your collection!"
                }
              />
            )}
          </Box>

          {/* Empty State Actions */}
          {!loading && movies.length === 0 && !error && (
            <VStack spacing={4} py={8}>
              <Text color="gray.400" textAlign="center" fontSize="lg">
                {activeTab === "watchlist"
                  ? "Discover amazing movies and add them to your watchlist!"
                  : "Find movies you love and mark them as favorites!"}
              </Text>
              <Button variant="cinema" size="lg" onClick={() => (window.location.href = "/search")}>
                Discover Movies
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default WatchlistPage
