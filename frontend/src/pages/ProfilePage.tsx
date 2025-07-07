"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Badge,
  IconButton,
} from "@chakra-ui/react"
import { FaEdit, FaSave, FaTimes, FaFilm, FaHeart, FaBookmark, FaStar } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toast = useToast()

  // Mock user stats - in a real app, these would come from the backend
  const userStats = {
    moviesWatched: 127,
    favorites: 23,
    watchlist: 45,
    averageRating: 4.2,
    reviewsWritten: 18,
    joinDate: "January 2024",
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.username) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    })
    setErrors({})
    setIsEditing(false)
  }

  if (!user) {
    return (
      <Box minH="100vh" bg="dark.300" py={8}>
        <Container maxW="container.md">
          <Text color="white" textAlign="center">
            Loading profile...
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="dark.300" py={8}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Box bg="dark.100" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            <VStack spacing={6}>
              <HStack justify="space-between" w="full">
                <HStack spacing={6}>
                  <Avatar
                    size="xl"
                    src={user.avatar || "/default-avatar.png"}
                    bg="cinema.500"
                    color="white"
                    name={user.username}
                  />
                  <VStack align="start" spacing={2}>
                    {isEditing ? (
                      <VStack align="start" spacing={3}>
                        <FormControl isInvalid={!!errors.username}>
                          <FormLabel color="white" fontSize="sm">
                            Username
                          </FormLabel>
                          <Input
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            bg="dark.200"
                            color="white"
                            borderColor="gray.600"
                            size="sm"
                          />
                          <FormErrorMessage>{errors.username}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                          <FormLabel color="white" fontSize="sm">
                            Email
                          </FormLabel>
                          <Input
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            bg="dark.200"
                            color="white"
                            borderColor="gray.600"
                            size="sm"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      </VStack>
                    ) : (
                      <>
                        <Heading as="h1" size="lg" color="white">
                          {user.username}
                        </Heading>
                        <Text color="gray.400">{user.email}</Text>
                        <Badge colorScheme="green" variant="subtle">
                          Member since {userStats.joinDate}
                        </Badge>
                      </>
                    )}
                  </VStack>
                </HStack>

                <VStack>
                  {isEditing ? (
                    <HStack>
                      <IconButton
                        aria-label="Save changes"
                        icon={<FaSave />}
                        onClick={handleSave}
                        isLoading={isSubmitting}
                        variant="cinema"
                        size="sm"
                      />
                      <IconButton
                        aria-label="Cancel editing"
                        icon={<FaTimes />}
                        onClick={handleCancel}
                        variant="outline"
                        colorScheme="gray"
                        size="sm"
                      />
                    </HStack>
                  ) : (
                    <IconButton
                      aria-label="Edit profile"
                      icon={<FaEdit />}
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      colorScheme="gray"
                      size="sm"
                    />
                  )}
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* User Statistics */}
          <Box bg="dark.100" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            <Heading as="h2" size="md" color="white" mb={6}>
              Your Movie Stats
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
              <Stat textAlign="center">
                <Box mb={2}>
                  <FaFilm size={24} color="#ff0000" />
                </Box>
                <StatNumber color="white" fontSize="2xl">
                  {userStats.moviesWatched}
                </StatNumber>
                <StatLabel color="gray.400">Movies Watched</StatLabel>
              </Stat>

              <Stat textAlign="center">
                <Box mb={2}>
                  <FaHeart size={24} color="#ff0000" />
                </Box>
                <StatNumber color="white" fontSize="2xl">
                  {userStats.favorites}
                </StatNumber>
                <StatLabel color="gray.400">Favorites</StatLabel>
              </Stat>

              <Stat textAlign="center">
                <Box mb={2}>
                  <FaBookmark size={24} color="#ffbb00" />
                </Box>
                <StatNumber color="white" fontSize="2xl">
                  {userStats.watchlist}
                </StatNumber>
                <StatLabel color="gray.400">Watchlist</StatLabel>
              </Stat>

              <Stat textAlign="center">
                <Box mb={2}>
                  <FaStar size={24} color="#ffd700" />
                </Box>
                <StatNumber color="white" fontSize="2xl">
                  {userStats.averageRating}
                </StatNumber>
                <StatLabel color="gray.400">Avg Rating</StatLabel>
              </Stat>

              <Stat textAlign="center">
                <Box mb={2}>
                  <FaEdit size={24} color="#ff0000" />
                </Box>
                <StatNumber color="white" fontSize="2xl">
                  {userStats.reviewsWritten}
                </StatNumber>
                <StatLabel color="gray.400">Reviews Written</StatLabel>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Account Settings */}
          <Box bg="dark.100" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            <Heading as="h2" size="md" color="white" mb={6}>
              Account Settings
            </Heading>
            <VStack spacing={4} align="stretch">
              <Button variant="outline" colorScheme="gray" justifyContent="flex-start">
                Change Password
              </Button>
              <Button variant="outline" colorScheme="gray" justifyContent="flex-start">
                Privacy Settings
              </Button>
              <Button variant="outline" colorScheme="gray" justifyContent="flex-start">
                Notification Preferences
              </Button>
              <Divider borderColor="gray.600" />
              <Button variant="outline" colorScheme="red" justifyContent="flex-start">
                Delete Account
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default ProfilePage
