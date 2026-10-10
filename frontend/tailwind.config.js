/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#030712',
        midnight: '#0a1024',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(59,130,246,0.55)',
        'glow-sm': '0 8px 24px -8px rgba(59,130,246,0.5)',
      },
    },
  },
  plugins: [],
};
