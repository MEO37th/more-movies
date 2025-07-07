"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Avatar,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons"
import { FaFilm, FaHeart, FaList, FaUser, FaSignOutAlt } from "react-icons/fa"

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <Box bg="dark.200" px={4} boxShadow="0 2px 10px rgba(0,0,0,0.3)" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          variant="ghost"
          color="white"
          _hover={{ bg: "cinema.900" }}
        />

        <HStack spacing={8} alignItems="center">
          <Box>
            <Link to="/">
              <Flex alignItems="center">
                <FaFilm size={24} color="#ff0000" />
                <Box as="span" ml={2} fontWeight="bold" fontSize="xl" color="white">
                  CinemaSphere
                </Box>
              </Flex>
            </Link>
          </Box>

          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <Link to="/">
              <Button variant="ghost" color="white" _hover={{ bg: "cinema.900" }}>
                Home
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" color="white" _hover={{ bg: "cinema.900" }}>
                Discover
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/watchlist">
                <Button variant="ghost" color="white" _hover={{ bg: "cinema.900" }}>
                  Watchlist
                </Button>
              </Link>
            )}
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <form onSubmit={handleSearch}>
            <InputGroup size="md" maxW={{ base: "150px", md: "300px" }}>
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="dark.100"
                color="white"
                borderColor="gray.600"
                _hover={{ borderColor: "cinema.500" }}
                _focus={{ borderColor: "cinema.500", boxShadow: "0 0 0 1px #ff0000" }}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" type="submit" bg="cinema.500" color="white" _hover={{ bg: "cinema.600" }}>
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>

          {isAuthenticated ? (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} ml={4}>
                <Avatar
                  size="sm"
                  src={user?.avatar || "/default-avatar.png"}
                  bg="cinema.500"
                  color="white"
                  name={user?.username}
                />
              </MenuButton>
              <MenuList bg="dark.100" borderColor="gray.700">
                <MenuItem icon={<FaUser />} as={Link} to="/profile" _hover={{ bg: "dark.200" }}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FaList />} as={Link} to="/watchlist" _hover={{ bg: "dark.200" }}>
                  Watchlist
                </MenuItem>
                <MenuItem icon={<FaHeart />} as={Link} to="/favorites" _hover={{ bg: "dark.200" }}>
                  Favorites
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FaSignOutAlt />} onClick={logout} _hover={{ bg: "dark.200" }}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={4} ml={4}>
              <Link to="/login">
                <Button variant="outline" colorScheme="red" size="sm" _hover={{ bg: "cinema.900" }}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="cinema" size="sm">
                  Sign Up
                </Button>
              </Link>
            </HStack>
          )}
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: "none" }} bg="dark.200">
          <Stack as="nav" spacing={4}>
            <Link to="/">
              <Button w="full" variant="ghost" color="white" justifyContent="flex-start">
                Home
              </Button>
            </Link>
            <Link to="/search">
              <Button w="full" variant="ghost" color="white" justifyContent="flex-start">
                Discover
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/watchlist">
                  <Button w="full" variant="ghost" color="white" justifyContent="flex-start">
                    Watchlist
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button w="full" variant="ghost" color="white" justifyContent="flex-start">
                    Profile
                  </Button>
                </Link>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Navbar
