import type React from "react"
import { Box, Container, Stack, Text, Link, IconButton, Flex } from "@chakra-ui/react"
import { FaTwitter, FaInstagram, FaFacebook, FaGithub } from "react-icons/fa"

const Footer: React.FC = () => {
  return (
    <Box bg="dark.200" color="gray.200" mt={10}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Stack direction={"column"} spacing={6} align={{ base: "center", md: "flex-start" }}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>
                Cinema
                <Box as="span" color="cinema.500">
                  Sphere
                </Box>
              </Text>
              <Text fontSize="sm" lineHeight="1.5">
                Discover your next favorite movie with our personalized recommendations.
              </Text>
            </Box>
            <Text fontSize={"sm"}>© {new Date().getFullYear()} CinemaSphere. All rights reserved</Text>
          </Stack>

          <Stack direction={"column"} spacing={6} align={{ base: "center", md: "flex-end" }} mt={{ base: 4, md: 0 }}>
            <Stack direction={"row"} spacing={6}>
              <IconButton
                aria-label={"Twitter"}
                icon={<FaTwitter />}
                size="md"
                color="white"
                variant="ghost"
                _hover={{ bg: "cinema.900", color: "cinema.500" }}
              />
              <IconButton
                aria-label={"Instagram"}
                icon={<FaInstagram />}
                size="md"
                color="white"
                variant="ghost"
                _hover={{ bg: "cinema.900", color: "cinema.500" }}
              />
              <IconButton
                aria-label={"Facebook"}
                icon={<FaFacebook />}
                size="md"
                color="white"
                variant="ghost"
                _hover={{ bg: "cinema.900", color: "cinema.500" }}
              />
              <IconButton
                aria-label={"Github"}
                icon={<FaGithub />}
                size="md"
                color="white"
                variant="ghost"
                _hover={{ bg: "cinema.900", color: "cinema.500" }}
              />
            </Stack>
            <Stack direction={"row"} spacing={6}>
              <Link href={"#"} color="gray.400" _hover={{ color: "cinema.500" }}>
                Privacy
              </Link>
              <Link href={"#"} color="gray.400" _hover={{ color: "cinema.500" }}>
                Terms
              </Link>
              <Link href={"#"} color="gray.400" _hover={{ color: "cinema.500" }}>
                Contact
              </Link>
            </Stack>
            <Text fontSize="xs" color="gray.500">
              Powered by TMDB API
            </Text>
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
