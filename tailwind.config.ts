import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cherry: {
          50: '#fdf2f4',
          100: '#fce7ec',
          200: '#f9d0db',
          300: '#f4a8bc',
          400: '#ed7497',
          500: '#e24a76',
          600: '#cc2959',
          700: '#ab1d47',
          800: '#8B1A4A',
          900: '#7a1940',
        },
        rosegold: {
          DEFAULT: '#C9956C',
          light: '#DEB896',
          dark: '#A67852',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          dark: '#F5EDE0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(3deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
