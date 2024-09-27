const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        'roboto': ['Roboto', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif']
      }
    },
    extend: {
      textShadow: {
        sm: '1px 1px 2px black',
        DEFAULT: '1px 2px 4px black',
        lg: '1px 8px 16px black'
      }
    }
    
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ]
}

