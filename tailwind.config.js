/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'medical-blue': '#1E40AF',
          'medical-light': '#F0F9FF',
        },
      },
    },
    plugins: [],
  }