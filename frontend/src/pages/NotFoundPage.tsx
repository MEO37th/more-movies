import type React from "react"
import { Box, Container, VStack, Heading, Text, Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { FaFilm, FaHome } from "react-icons/fa"

const NotFoundPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="dark.300" py={16}>
      <Container maxW="md">
        <VStack spacing={8} textAlign="center">
          <Box p={6} bg="cinema.500" borderRadius="full">
            <FaFilm size={48} color="white" />
          </Box>

          <VStack spacing={4}>
            <Heading as="h1" size="2xl" color="white">
              404
            </Heading>
            <Heading as="h2" size="lg" color="white">
              Page Not Found
            </Heading>
            <Text color="gray.400" fontSize="lg" maxW="md">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
              wrong URL.
            </Text>
          </VStack>

          <VStack spacing={4}>
            <Link to="/">
              <Button leftIcon={<FaHome />} variant="cinema" size="lg">
                Go Home
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline" colorScheme="gray" size="md">
                Discover Movies
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFoundPage
