/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d6',
          300: '#f5a8b5',
          400: '#a67c8a',
          500: '#8B4B5C',
          600: '#7A4A57',
          700: '#6a3f4b',
          800: '#5a353f',
          900: '#4a2b33',
        },
        secondary: {
          50: '#f8f7ff',
          100: '#f1efff',
          200: '#e6e3ff',
          300: '#d1cbff',
          400: '#b5a8ff',
          500: '#9580ff',
          600: '#8366f7',
          700: '#7354e3',
          800: '#5d46bf',
          900: '#4c3d9c',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#252a3a',
          900: '#1a1f2e',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'professional-gradient': 'linear-gradient(135deg, #1a1f2e 0%, #252a3a 50%, #334155 100%)',
      },
    },
  },
  plugins: [],
}