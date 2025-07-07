import api from "./api"

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      return response.data
    } catch (error) {
      throw new Error("Invalid credentials")
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { username, email, password })
      return response.data
    } catch (error) {
      throw new Error("Registration failed")
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error) {
      throw new Error("Failed to get user data")
    }
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await api.put("/auth/profile", userData)
      return response.data
    } catch (error) {
      throw new Error("Failed to update profile")
    }
  },

  forgotPassword: async (email: string) => {
    try {
      await api.post("/auth/forgot-password", { email })
      return true
    } catch (error) {
      throw new Error("Failed to process password reset")
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      await api.post("/auth/reset-password", { token, password })
      return true
    } catch (error) {
      throw new Error("Failed to reset password")
    }
  },
}
