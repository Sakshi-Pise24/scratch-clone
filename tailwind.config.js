/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // This tells Tailwind to look for classes in these files
  ],
  theme: {
    extend: {
      // Here you can customize your theme
      colors: {
        primary: {
          light: '#60a5fa',  // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',    // blue-600
        },
        secondary: {
          light: '#f97316',  // orange-500
          DEFAULT: '#ea580c', // orange-600
          dark: '#c2410c',   // orange-700
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}

