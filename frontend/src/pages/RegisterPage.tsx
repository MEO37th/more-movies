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
  Checkbox,
} from "@chakra-ui/react"
import { FaFilm, FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const { register, isAuthenticated, isLoading } = useAuth()
  const toast = useToast()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions"
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
      await register(formData.username, formData.email, formData.password)
      toast({
        title: "Account created!",
        description: "Welcome to CinemaSphere! Your account has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.")
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
              Join CinemaSphere
            </Heading>
            <Text color="gray.400">Create your account to start discovering amazing movies</Text>
          </VStack>

          {/* Registration Form */}
          <Box bg="dark.100" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.700">
            {apiError && (
              <Alert status="error" mb={6} bg="red.900" color="white">
                <AlertIcon />
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel color="white">Username</FormLabel>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Choose a username"
                    bg="dark.200"
                    color="white"
                    borderColor="gray.600"
                    _hover={{ borderColor: "cinema.500" }}
                    _focus={{ borderColor: "cinema.500", boxShadow: "0 0 0 1px #ff0000" }}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color="white">Email Address</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Create a password"
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

                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel color="white">Confirm Password</FormLabel>
                  <Box position="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      color="gray.400"
                      _hover={{ color: "white" }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </Box>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.terms}>
                  <Checkbox
                    isChecked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    colorScheme="red"
                  >
                    <Text color="white" fontSize="sm">
                      I agree to the{" "}
                      <Text as="span" color="cinema.500" _hover={{ textDecoration: "underline" }}>
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text as="span" color="cinema.500" _hover={{ textDecoration: "underline" }}>
                        Privacy Policy
                      </Text>
                    </Text>
                  </Checkbox>
                  <FormErrorMessage>{errors.terms}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  variant="cinema"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Creating Account..."
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Divider my={6} borderColor="gray.600" />

            <VStack spacing={4} textAlign="center">
              <Text color="gray.400">
                Already have an account?{" "}
                <Link to="/login">
                  <Text as="span" color="cinema.500" _hover={{ textDecoration: "underline" }}>
                    Sign in here
                  </Text>
                </Link>
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default RegisterPage
