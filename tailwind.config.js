/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2C4270',
          50: '#EEF1F6',
        },
        ink: '#16202E',
        paper: '#F7F7F5',
        line: '#E4E4E1',
        accent: {
          orange: '#C4783A',
          'orange-soft': '#FBF0E6',
          green: '#2E7D5B',
          'green-soft': '#E9F4EF',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
