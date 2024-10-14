/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to scan these files for class names
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A4A4A',   // Example for dark gray
        secondary: '#A3A3A3', // Example for light gray
        accent: '#C2B8A3',    // Example for warm taupe
      },
    },
  },
  plugins: [],
}
