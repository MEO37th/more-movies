"use client"

import React, { useState } from "react"
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Button,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal"
import { Tooltip } from "@chakra-ui/tooltip"
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaStar, FaPlay, FaImdb } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface Crew {
  id: number
  name: string
  job: string
}

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

interface MovieDetailsProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    runtime: number
    vote_average: number
    vote_count: number
    overview: string
    genres: { id: number; name: string }[]
    imdb_id?: string
    tagline?: string
    production_companies?: { id: number; name: string; logo_path: string | null }[]
  }
  credits: {
    cast: Cast[]
    crew: Crew[]
  }
  videos: Video[]
  similar: {
    results: {
      id: number
      title: string
      poster_path: string | null
      vote_average: number
    }[]
  }
  isFavorite: boolean
  isWatchlist: boolean
  onToggleFavorite: () => void
  onToggleWatchlist: () => void
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  credits,
  videos,
  similar,
  isFavorite,
  isWatchlist,
  onToggleFavorite,
  onToggleWatchlist,
}) => {
  const { isAuthenticated } = useAuth()
  const { open, onOpen, onClose } = useDisclosure()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const director = credits.crew.find((person) => person.job === "Director")
  const trailer = videos.find((video) => video.type === "Trailer" && video.site === "YouTube")

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handlePlayTrailer = (video: Video) => {
    setSelectedVideo(video)
    onOpen()
  }

  return (
    <>
      <Box position="relative" height={{ base: "200px", md: "400px" }} mb={{ base: 0, md: 6 }} overflow="hidden">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage={movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : "none"}
          backgroundSize="cover"
          backgroundPosition="center"
          filter="brightness(40%)"
        />
        <Box position="absolute" bottom={0} left={0} right={0} height="100%" bgGradient="linear(to-t, black, transparent 70%)" />
      </Box>

      <Flex direction={{ base: "column", md: "row" }} mt={{ base: "-100px", md: "-150px" }} position="relative" zIndex={1} px={{ base: 4, md: 8 }}>
        <Box width={{ base: "200px", md: "300px" }} mx={{ base: "auto", md: 0 }} mb={{ base: 6, md: 0 }}>
          <Image
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/movie-placeholder.jpg"}
            alt={movie.title}
            borderRadius="lg"
            boxShadow="xl"
            objectFit="cover"
            width="100%"
          />
        </Box>

        <Box flex="1" ml={{ base: 0, md: 8 }} color="white">
          <Heading as="h1" size="xl" mb={2}>
            {movie.title}
          </Heading>

          {movie.tagline && (
            <Text fontSize="lg" fontStyle="italic" color="gray.400" mb={4}>
              {movie.tagline}
            </Text>
          )}

          <HStack gap={4} mb={6} flexWrap="wrap">
            {movie.release_date && <Text color="gray.300">{new Date(movie.release_date).getFullYear()}</Text>}
            {movie.runtime > 0 && <Text color="gray.300">{formatRuntime(movie.runtime)}</Text>}
            <Flex align="center">
              <FaStar color="#FFD700" style={{ marginRight: "6px" }} />
              <Text fontWeight="bold">{movie.vote_average.toFixed(1)}</Text>
              <Text color="gray.400" fontSize="sm" ml={1}>
                ({movie.vote_count.toLocaleString()})
              </Text>
            </Flex>
          </HStack>

          <Flex mb={6} flexWrap="wrap" gap={2}>
            {movie.genres.map((genre) => (
              <Badge key={genre.id} px={3} py={1} borderRadius="full" colorScheme="gray" variant="subtle">
                {genre.name}
              </Badge>
            ))}
          </Flex>

          <Flex mb={6} gap={4}>
            {trailer && (
              <Button 
                onClick={() => handlePlayTrailer(trailer)} 
                variant="solid"
              >
                <FaPlay style={{ marginRight: '8px' }} />
                Play Trailer
              </Button>
            )}

            {isAuthenticated && (
              <>
                <Tooltip label={isWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
                  <IconButton
                    aria-label={isWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    children={isWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                    onClick={onToggleWatchlist}
                    variant="outline"
                    colorScheme={isWatchlist ? "yellow" : "gray"}
                  />
                </Tooltip>
                <Tooltip label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <IconButton
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    children={isFavorite ? <FaHeart /> : <FaRegHeart />}
                    onClick={onToggleFavorite}
                    variant="outline"
                    colorScheme={isFavorite ? "red" : "gray"}
                  />
                </Tooltip>
              </>
            )}

            {movie.imdb_id && (
              <Link href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="View on IMDb"
                  children={<FaImdb size="24px" />}
                  variant="outline"
                  colorScheme="yellow"
                />
              </Link>
            )}
          </Flex>

          <Box mb={6}>
            <Heading as="h3" size="md" mb={2}>
              Overview
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              {movie.overview || "No overview available."}
            </Text>
          </Box>

          {director && (
            <Box mb={6}>
              <Text>
                <Text as="span" fontWeight="bold">Director:</Text> {director.name}
              </Text>
            </Box>
          )}

          {credits.cast.length > 0 && (
            <Box mb={6}>
              <Heading as="h3" size="md" mb={3}>Cast</Heading>
              <Flex
                overflowX="auto"
                pb={4}
                gap={4}
                css={{
                  "&::-webkit-scrollbar": { height: "8px" },
                  "&::-webkit-scrollbar-track": { background: "rgba(0, 0, 0, 0.1)" },
                  "&::-webkit-scrollbar-thumb": { background: "red.500", borderRadius: "4px" }
                }}
              >
                {credits.cast.slice(0, 10).map((person) => (
                  <Box key={person.id} minW="100px" textAlign="center">
                    <Image
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "/person-placeholder.jpg"}
                      alt={person.name}
                      borderRadius="md"
                      mb={2}
                      width="100px"
                      height="150px"
                      objectFit="cover"
                    />
                    <Text fontWeight="medium" fontSize="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{person.name}</Text>
                    <Text fontSize="xs" color="gray.400" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{person.character}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>

      <Modal isOpen={open} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>{selectedVideo?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedVideo && (
              <Box position="relative" paddingBottom="56.25%" height="0" overflow="hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                  title={selectedVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                  }}
                />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MovieDetails