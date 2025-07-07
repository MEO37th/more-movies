"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Container, Heading, Text, Button, Flex, HStack, useBreakpointValue } from "@chakra-ui/react"
import { movieService } from "../services/movieService"
import MovieGrid from "../components/movies/MovieGrid"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { FaPlay, FaInfoCircle } from "react-icons/fa"

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([])
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [genres, setGenres] = useState<{ [id: number]: string }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch genres
        const genresData = await movieService.getGenres()
        const genresMap = genresData.reduce((acc: { [id: number]: string }, genre: { id: number; name: string }) => {
          acc[genre.id] = genre.name
          return acc
        }, {})
        setGenres(genresMap)

        // Fetch trending movies
        const trendingData = await movieService.getTrending()
        setTrendingMovies(trendingData.results)

        // Use the first few trending movies as featured
        setFeaturedMovies(trendingData.results.slice(0, 5))
      } catch (err) {
        console.error("Error fetching homepage data:", err)
        setError("Failed to load movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Auto-rotate featured movies
  useEffect(() => {
    if (featuredMovies.length === 0) return

    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) => (prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1))
    }, 8000)

    return () => clearInterval(interval)
  }, [featuredMovies])

  const handlePrevFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => (prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1))
  }

  const handleNextFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => (prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1))
  }

  if (loading && !trendingMovies.length) {
    return (
      <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
        <LoadingSpinner />
      </Box>
    )
  }

  const currentFeatured = featuredMovies[currentFeaturedIndex]

  return (
    <Box>
      {/* Hero Section with Featured Movie */}
      {currentFeatured && (
        <Box position="relative" height={{ base: "500px", md: "70vh" }} mb={10} overflow="hidden">
          {/* Background Image */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgImage={`url(https://image.tmdb.org/t/p/original${currentFeatured.backdrop_path})`}
            bgSize="cover"
            backgroundPosition="center"
            filter="auto"
            brightness="40%"
            transition="all 0.5s ease-in-out"
          />

          {/* Gradient Overlay */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height="100%"
            bgGradient="linear(to-t, dark.300, transparent 60%)"
          />

          {/* Content */}
          <Container maxW="container.xl" height="100%" position="relative">
            <Flex height="100%" direction="column" justifyContent="flex-end" pb={{ base: 10, md: 16 }} px={4}>
              <Heading as="h1" size="xl">
                {currentFeatured.title}
              </Heading>
              <Text fontSize="lg" color="whiteAlpha.800" mb={4}>
                {currentFeatured.overview}
              </Text>
              <HStack gap={4}>
                <Button colorScheme="blue" variant="solid">
                  <FaPlay style={{ marginRight: "6px" }}/>Watch Now
                </Button>
                <Button colorScheme="gray" variant="outline">
                  <FaInfoCircle style={{ marginRight: "6px" }}/>More Info
                </Button>
              </HStack>
            </Flex>
          </Container>
        </Box>
      )}

      {/* Trending Movies Section */}
      {trendingMovies.length > 0 && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Trending Movies
          </Heading>
          <MovieGrid movies={trendingMovies} genres={genres} loading={loading} error={error} />
        </Box>
      )}

      {/* Error Section */}
      {error && (
        <Box textAlign="center" py={10}>
          <Text color="red.500">{error}</Text>
        </Box>
      )}
    </Box>
  )
}

export default HomePage
