/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#101820',
        panel: '#F7FAFC',
        ember: '#E84D3D',
        leaf: '#2F855A',
        tide: '#277DA1',
        volt: '#F4C430',
      },
    },
  },
  plugins: [],
};
