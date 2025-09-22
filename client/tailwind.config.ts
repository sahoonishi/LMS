/** @type {import('tailwindcss').Config} */
// Removed invalid @config line
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        bg:'#ffffff'
      },
    },
  },
  plugins: [],
}