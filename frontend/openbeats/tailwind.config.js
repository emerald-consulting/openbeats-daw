const { fontFamily } = require('tailwindcss/defaultTheme')
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Roboto'],
    },
    colors:{
      "gr1":"#006622",
      "gr2":"#158236",
      "gr3":"#359E50",
      "gr4":"#68BC76",
      "err":"FF00FF"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
