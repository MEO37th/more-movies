import type React from "react"
import { Flex, Spinner, Text } from "@chakra-ui/react"

interface LoadingSpinnerProps {
  text?: string
  size?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading...", size = "xl" }) => {
  return (
    <Flex direction="column" justify="center" align="center" p={8}>
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.700" color="cinema.500" size={size} mb={4} />
      {text && <Text color="gray.400">{text}</Text>}
    </Flex>
  )
}

export default LoadingSpinner
