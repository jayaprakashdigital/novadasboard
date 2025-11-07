/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A53758',
          dark: '#87143B',
          light: '#F9DFDF',
        },
        accent: {
          DEFAULT: '#A53758',
          dark: '#87143B',
        },
      },
    },
  },
  plugins: [],
};
