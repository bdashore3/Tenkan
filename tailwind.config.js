module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        whitesmoke: '#f5f5f5',
        darkbg: '#17202b',
        lightbg: '#1b2532',
        fadebg: '#243142',
        blurple: '#7289da',
        orange: {
          400: '#f6ad55'
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
}
