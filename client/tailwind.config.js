import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark SaaS palette — slate/indigo/purple
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        surface: {
          900: '#0f172a', // slate-950 equivalent
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'grid-white': "linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-16': '16px 16px',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // Glassmorphism card utility
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-sm': {
          background: 'rgba(255, 255, 255, 0.03)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        },
        '.glass-dark': {
          background: 'rgba(15, 23, 42, 0.6)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        },
        // Blob animations
        '.animate-blob': {
          animation: 'blob 7s infinite',
        },
        '.animation-delay-2000': {
          animationDelay: '2s',
        },
        '.animation-delay-4000': {
          animationDelay: '4s',
        },
        '.animation-delay-6000': {
          animationDelay: '6s',
        },
      });
    }),
  ],
};
