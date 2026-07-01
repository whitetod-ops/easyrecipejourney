/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        linen:   '#F8F4EF',
        cream:   '#E8D5C0',
        sand:    '#E0CDB8',
        espresso:'#2C2018',
        bark:    '#6B5040',
        muted:   '#9A8070',
        terra:   '#8B5E3C',
        border:  '#E0D0C0',
      },
      fontFamily: {
        serif:  ['Fraunces', 'Georgia', 'serif'],
        sans:   ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
