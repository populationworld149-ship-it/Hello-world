/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe-pink': '#E84E8A',
        'cafe-light-pink': '#FCE4EC',
        'cafe-bg': '#E84E8A',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
