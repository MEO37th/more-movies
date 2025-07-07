"use client"

import type React from "react"
import { Box, Heading, Wrap, WrapItem, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"

interface Genre {
  id: number
  name: string
}

interface GenreFilterProps {
  genres: Genre[]
  selectedGenres: number[]
  onSelectGenre: (genreId: number) => void
  onRemoveGenre: (genreId: number) => void
}

const GenreFilter: React.FC<GenreFilterProps> = ({ genres, selectedGenres, onSelectGenre, onRemoveGenre }) => {
  return (
    <Box mb={6}>
      <Heading as="h3" size="md" mb={3}>
        Genres
      </Heading>

      {selectedGenres.length > 0 && (
        <Box mb={4}>
          <Heading as="h4" size="xs" mb={2} color="gray.400">
            Selected:
          </Heading>
          <Wrap spacing={2}>
            {selectedGenres.map((genreId) => {
              const genre = genres.find((g) => g.id === genreId)
              return genre ? (
                <WrapItem key={`selected-${genreId}`}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="red" bg="cinema.600">
                    <TagLabel>{genre.name}</TagLabel>
                    <TagCloseButton onClick={() => onRemoveGenre(genreId)} />
                  </Tag>
                </WrapItem>
              ) : null
            })}
          </Wrap>
        </Box>
      )}

      <Wrap spacing={2}>
        {genres
          .filter((genre) => !selectedGenres.includes(genre.id))
          .map((genre) => (
            <WrapItem key={genre.id}>
              <Tag
                size="md"
                borderRadius="full"
                variant="outline"
                colorScheme="gray"
                cursor="pointer"
                onClick={() => onSelectGenre(genre.id)}
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <TagLabel>{genre.name}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  )
}

export default GenreFilter
