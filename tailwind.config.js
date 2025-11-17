/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkGreen: '#0A4C3A',
          yellow: '#F4C20D',
          offWhite: '#F7F9FA',
          richBlack: '#0F1115',
          slateGray: '#4F5A67'
        },
        admin: {
          white: '#FFFFFF',
          sidebar: '#F4F6F8',
          blue: '#0A4C3A',
          border: '#E4E7EB',
          text: '#0F1115',
          muted: '#6B7280'
        }
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};
