/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-green': '#98FB98',
        'pastel-purple': '#E6E6FA',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
