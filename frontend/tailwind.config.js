/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          50: "#ffe6e6",
          100: "#ffcccc",
          200: "#ff9999",
          300: "#ff6666",
          400: "#ff3333",
          500: "#ff0000",
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
      fontFamily: {
        heading: ['"Montserrat"', "sans-serif"],
        body: ['"Open Sans"', "sans-serif"],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}