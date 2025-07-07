import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MovieDetailsPage from "./pages/MovieDetailsPage"
import SearchPage from "./pages/SearchPage"
import ProfilePage from "./pages/ProfilePage"
import WatchlistPage from "./pages/WatchlistPage"
import NotFoundPage from "./pages/NotFoundPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./index.css"

// Custom theme with cinema-inspired colors
const theme = extendTheme({
  colors: {
    cinema: {
      50: "#ffe6e6",
      100: "#ffcccc",
      200: "#ff9999",
      300: "#ff6666",
      400: "#ff3333",
      500: "#ff0000", // Primary cinema red
      600: "#cc0000",
      700: "#990000",
      800: "#660000",
      900: "#330000",
    },
    dark: {
      100: "#1a1a1a",
      200: "#141414",
      300: "#0a0a0a",
    },
    gold: {
      300: "#ffd700",
      400: "#ffcc00",
      500: "#ffbb00",
    },
  },
  fonts: {
    heading: '"Montserrat", sans-serif',
    body: '"Open Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: "#0a0a0a",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      variants: {
        cinema: {
          bg: "cinema.500",
          color: "white",
          _hover: {
            bg: "cinema.600",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
          _active: {
            bg: "cinema.700",
          },
        },
        gold: {
          bg: "gold.400",
          color: "black",
          _hover: {
            bg: "gold.500",
          },
        },
      },
    },
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-dark-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <WatchlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
