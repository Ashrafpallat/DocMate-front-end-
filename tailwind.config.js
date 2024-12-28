// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to scan these files for class names
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#4A4A4A',   // Example for dark gray
//         secondary: '#A3A3A3', // Example for light gray
//         accent: '#C2B8A3',    // Example for warm taupe
//       },
//     },
//   },
//   plugins: [],
// }

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
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-out', // Define the 'pop' animation
      },
    },
  },
  plugins: [],
};
