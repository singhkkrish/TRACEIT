/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gray': '#f4f4f4', // Matches the specific grey background from the image
        'neon-green': '#4dff05', // The bright green from the design
        'card-gray': '#e6e6e6',
      },
      borderRadius: {
        '4xl': '2.5rem', // Extra large rounded corners
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

