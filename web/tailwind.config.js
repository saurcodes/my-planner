/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0f0a1e',
        'deep-indigo': '#1a1333',
        twilight: '#2d1f4d',
        dusk: '#4a3069',
        'sunset-pink': '#e85d75',
        'sunset-orange': '#ff8a5b',
        'sunset-gold': '#ffd97d',
        'acid-lime': '#d4fc79',
        'electric-cyan': '#96fbc4',
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#667eea',
          600: '#4e54c8',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient-flow': 'gradientFlow 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
