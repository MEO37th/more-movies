"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Box, Container, Heading, VStack, HStack, Select, Text } from "@chakra-ui/react"
import { movieService } from "../services/movieService"
import MovieGrid from "../components/movies/MovieGrid"
import SearchBar from "../components/ui/SearchBar"
import GenreFilter from "../components/ui/GenreFilter"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [genresMap, setGenresMap] = useState<{ [id: number]: string }>({})
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [searchQuery, setSearchQuery] = useState("")

  const initialQuery = searchParams.get("q") || ""

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await movieService.getGenres()
        setGenres(genresData)
        const genresMap = genresData.reduce((acc: { [id: number]: string }, genre: { id: number; name: string }) => {
          acc[genre.id] = genre.name
          return acc
        }, {})
        setGenresMap(genresMap)
      } catch (err) {
        console.error("Error fetching genres:", err)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
      handleSearch(initialQuery)
    } else {
      fetchDiscoverMovies()
    }
  }, [initialQuery])

  const fetchDiscoverMovies = async (page = 1, genreIds: number[] = [], sort = "popularity.desc") => {
    try {
      setLoading(true)
      setError(null)

      let data
      if (genreIds.length > 0) {
        data = await movieService.getMoviesByGenre(genreIds[0], page)
      } else {
        data = await movieService.getTrending(page)
      }

      if (page === 1) {
        setMovies(data.results)
      } else {
        setMovies((prev) => [...prev, ...data.results])
      }

      setTotalPages(data.total_pages)
      setCurrentPage(page)
    } catch (err) {
      console.error("Error fetching movies:", err)
      setError("Failed to load movies. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string, page = 1) => {
    if (!query.trim()) {
      fetchDiscoverMovies()
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSearchQuery(query)

      // Update URL params
      setSearchParams({ q: query })

      const data = await movieService.searchMovies(query, page)

      if (page === 1) {
        setMovies(data.results)
      } else {
        setMovies((prev) => [...prev, ...data.results])
      }

      setTotalPages(data.total_pages)
      setCurrentPage(page)
    } catch (err) {
      console.error("Error searching movies:", err)
      setError("Failed to search movies. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGenreSelect = (genreId: number) => {
    const newSelectedGenres = [...selectedGenres, genreId]
    setSelectedGenres(newSelectedGenres)
    setCurrentPage(1)
    setSearchQuery("")
    setSearchParams({})
    fetchDiscoverMovies(1, newSelectedGenres, sortBy)
  }

  const handleGenreRemove = (genreId: number) => {
    const newSelectedGenres = selectedGenres.filter((id) => id !== genreId)
    setSelectedGenres(newSelectedGenres)
    setCurrentPage(1)
    fetchDiscoverMovies(1, newSelectedGenres, sortBy)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1)
    if (searchQuery) {
      handleSearch(searchQuery, 1)
    } else {
      fetchDiscoverMovies(1, selectedGenres, newSort)
    }
  }

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    if (searchQuery) {
      handleSearch(searchQuery, nextPage)
    } else {
      fetchDiscoverMovies(nextPage, selectedGenres, sortBy)
    }
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSearchQuery("")
    setSearchParams({})
    setSortBy("popularity.desc")
    setCurrentPage(1)
    fetchDiscoverMovies()
  }

  return (
    <Box minH="100vh" bg="dark.300" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color="white">
              Discover Movies
            </Heading>
            <Text color="gray.400">Find your next favorite movie</Text>
          </VStack>

          {/* Search Bar */}
          <Box maxW="600px" mx="auto" w="full">
            <SearchBar onSearch={(query) => handleSearch(query, 1)} initialValue={searchQuery} />
          </Box>

          {/* Filters */}
          <Box bg="dark.100" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            <VStack spacing={6} align="stretch">
              {/* Genre Filter */}
              <GenreFilter
                genres={genres}
                selectedGenres={selectedGenres}
                onSelectGenre={handleGenreSelect}
                onRemoveGenre={handleGenreRemove}
              />

              {/* Sort and Clear Filters */}
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
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
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="release_date.desc">Newest</option>
                    <option value="title.asc">Title A-Z</option>
                  </Select>
                </HStack>

                {(selectedGenres.length > 0 || searchQuery) && (
                  <Text
                    color="cinema.500"
                    fontSize="sm"
                    cursor="pointer"
                    onClick={clearFilters}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Clear all filters
                  </Text>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Results */}
          <Box>
            {searchQuery && (
              <Text color="gray.400" mb={4}>
                {loading && movies.length === 0
                  ? "Searching..."
                  : `Search results for "${searchQuery}" (${movies.length} movies found)`}
              </Text>
            )}

            {loading && movies.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <MovieGrid
                movies={movies}
                loading={loading}
                error={error}
                genres={genresMap}
                hasMore={currentPage < totalPages}
                onLoadMore={handleLoadMore}
                emptyMessage={
                  searchQuery
                    ? `No movies found for "${searchQuery}". Try a different search term.`
                    : "No movies found. Try adjusting your filters."
                }
              />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default SearchPage
