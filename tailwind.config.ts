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
        cherry: '#E91E8C',
        'rose-gold': '#FF7EB6',
        champagne: '#FFD700',
        dark: '#1A0030',
        cream: '#FFF5F8',
        charcoal: '#1A0A1E',
        coral: '#FF5E5B',
        violet: '#7B2FBE',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config
