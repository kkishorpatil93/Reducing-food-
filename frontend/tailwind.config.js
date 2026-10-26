/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Primary green
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Warm orange
          600: '#EA580C',
          700: '#C2410C',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FFFBF2', // Base cream background
          200: '#FDF6E2',
          300: '#F8ECC8',
        },
        charcoal: {
          DEFAULT: '#1F2937',
          light: '#374151',
          dark: '#111827',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 15px rgba(22, 163, 74, 0.25)',
      }
    },
  },
  plugins: [],
}
