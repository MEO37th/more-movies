"use client"

import type React from "react"
import { useState } from "react"
import { InputGroup, Input, InputAddon, IconButton, Box } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons";
// import { forwardRef } from "react";


interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = "", placeholder = "Search for movies..." }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <InputGroup size="lg">
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="dark.100"
          color="white"
          borderColor="gray.600"
          _hover={{ borderColor: "cinema.500" }}
          _focus={{ borderColor: "cinema.500", boxShadow: "0 0 0 1px #ff0000" }}
          fontSize="md"
        />
        <InputAddon width="4.5rem">
          <IconButton
            h="1.75rem"
            size="sm"
            type="submit"
            aria-label="Search"
            _icon={<SearchIcon />}
            bg="cinema.500"
            color="white"
            _hover={{ bg: "cinema.600" }}
          />
        </InputAddon>
      </InputGroup>
    </Box>
  )
}

export default SearchBar
