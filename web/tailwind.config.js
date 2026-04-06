/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream backgrounds
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FEF0E3',
          300: '#FDE6D0',
          400: '#F8D4B4',
        },
        // Terracotta / Coral accent
        terra: {
          50: '#FEF3EE',
          100: '#FCDDC9',
          200: '#F9BFA0',
          300: '#F09D71',
          400: '#E8834F',
          500: '#D4714A',
          600: '#C05E38',
          700: '#A04B2E',
          800: '#7E3B25',
        },
        // Warm neutrals
        warm: {
          50: '#FAF8F6',
          100: '#F0EDEA',
          200: '#E2DEDB',
          300: '#C7C1BC',
          400: '#A8A19B',
          500: '#8B8580',
          600: '#6E6964',
          700: '#504C48',
          800: '#38352F',
          900: '#2D2A26',
        },
        // Semantic
        peach: '#F5D5C0',
        coral: '#E07A5F',
        sage: '#A8C5A0',
        sky: '#A5C4D4',
        sand: '#E8DDCB',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'warm': '0 4px 24px -4px rgba(208, 113, 74, 0.12)',
        'warm-lg': '0 12px 40px -8px rgba(208, 113, 74, 0.15)',
        'warm-xl': '0 20px 60px -12px rgba(208, 113, 74, 0.18)',
        'soft': '0 2px 16px -2px rgba(45, 42, 38, 0.06)',
        'soft-lg': '0 8px 32px -4px rgba(45, 42, 38, 0.08)',
        'card': '0 1px 3px rgba(45, 42, 38, 0.04), 0 6px 24px -4px rgba(45, 42, 38, 0.06)',
        'card-hover': '0 2px 8px rgba(45, 42, 38, 0.06), 0 12px 40px -8px rgba(208, 113, 74, 0.12)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
