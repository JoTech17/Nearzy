/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Official JoWala Red, White & Black Theme
          red: '#DC2626',       // Vibrant Primary Crimson Red
          redDark: '#991B1B',   // Deep Red
          redLight: '#FEF2F2',  // Light Red Tint
          black: '#0A0A0A',     // Pure Black
          dark: '#0A0A0A',      // Pure Black
          white: '#FFFFFF',     // Pure White
          muted: '#52525B',     // Zinc Muted Text
          light: '#F9FAFB',     // Crisp Light Background
          success: '#16A34A',
          danger: '#DC2626',
          // Theme Aliases (Mapping existing tokens to Red, Black & White)
          blue: '#DC2626',      // Red
          electric: '#B91C1C',  // Dark Red
          orange: '#DC2626',    // Red
          yellow: '#0A0A0A',    // Black
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(220, 38, 38, 0.08)',
        'glow': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
      }
    },
  },
  plugins: [],
}
