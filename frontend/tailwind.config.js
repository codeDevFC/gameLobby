/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'swedish-blue': '#005B99',
        'swedish-gold': '#FECC02',
        'nordic-dark': '#0A1628',
        'nordic-card': '#112240',
        'nordic-border': '#1A3355',
      }
    },
  },
  plugins: [],
};
