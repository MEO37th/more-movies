"use client"

import type React from "react"
import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Divider,
  useToast,
} from "@chakra-ui/react"
import { FaFilm, FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const { login, isAuthenticated, isLoading } = useAuth()
  const toast = useToast()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await login(email, password)
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      setApiError(error.message || "Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box minH="100vh" bg="dark.300" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Logo and Title */}
          <VStack spacing={4} textAlign="center">
            <Box p={4} bg="cinema.500" borderRadius="full">
              <FaFilm size={32} color="white" />
            </Box>
            <Heading as="h1" size="xl" color="white">
              Welcome Back
            </Heading>
            <Text color="gray.400">Sign in to your CinemaSphere account</Text>
          </VStack>

          {/* Login Form */}
          <Box bg="dark.100" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            {apiError && (
              <Alert status="error" mb={6} bg="red.900" color="white">
                <AlertIcon />
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color="white">Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="dark.200"
                    color="white"
                    borderColor="gray.600"
                    _hover={{ borderColor: "cinema.500" }}
                    _focus={{ borderColor: "cinema.500", boxShadow: "0 0 0 1px #ff0000" }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel color="white">Password</FormLabel>
                  <Box position="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="dark.200"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: "cinema.500" }}
                      _focus={{ borderColor: "cinema.500", boxShadow: "0 0 0 1px #ff0000" }}
                      pr="4.5rem"
                    />
                    <Button
                      position="absolute"
                      right="0"
                      top="0"
                      h="100%"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.400"
                      _hover={{ color: "white" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </Box>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  variant="cinema"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Signing In..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Divider my={6} borderColor="gray.600" />

            <VStack spacing={4} textAlign="center">
              <Text color="gray.400">
                Don't have an account?{" "}
                <Link to="/register">
                  <Text as="span" color="cinema.500" _hover={{ textDecoration: "underline" }}>
                    Sign up here
                  </Text>
                </Link>
              </Text>
              <Link to="/forgot-password">
                <Text color="cinema.500" fontSize="sm" _hover={{ textDecoration: "underline" }}>
                  Forgot your password?
                </Text>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default LoginPage
