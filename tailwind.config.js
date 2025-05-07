/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0f0f0f',
        'neon': '#c6ff00',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #c6ff00, 0 0 10px #c6ff00, 0 0 15px #c6ff00' },
          '100%': { boxShadow: '0 0 10px #c6ff00, 0 0 20px #c6ff00, 0 0 30px #c6ff00' },
        },
      },
    },
  },
  plugins: [],
} 