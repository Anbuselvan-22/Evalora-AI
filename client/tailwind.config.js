import plugin from 'tailwindcss/plugin';

// 🎨 Color Theme Options for Evalora AI
// Choose one of these themes and update the colors object below

const THEMES = {
  // Current: Indigo/Purple (Dark SaaS)
  current: {
    name: 'Indigo Purple',
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
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
    },
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  },

  // 🌅 Ocean Blue Theme
  ocean: {
    name: 'Ocean Blue',
    brand: {
      50:  '#e0f2fe',
      100: '#bae6fd',
      200: '#7dd3fc',
      300: '#38bdf8',
      400: '#0ea5e9',
      500: '#0284c7',
      600: '#0369a1',
      700: '#075985',
      800: '#0c4a6e',
      900: '#164e63',
      950: '#134e4a',
    },
    accent: {
      400: '#06b6d4',
      500: '#0891b2',
      600: '#0e7490',
    },
    surface: {
      900: '#083344',
      800: '#0c4a5e',
      700: '#164e63',
      600: '#155e75',
    },
    gradient: 'linear-gradient(135deg, #083344 0%, #164e63 50%, #083344 100%)',
  },

  // 🌿 Emerald Forest Theme
  emerald: {
    name: 'Emerald Forest',
    brand: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    accent: {
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
    },
    surface: {
      900: '#022c22',
      800: '#064e3b',
      700: '#047857',
      600: '#065f46',
    },
    gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
  },

  // 🔥 Sunset Orange Theme
  sunset: {
    name: 'Sunset Orange',
    brand: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    accent: {
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },
    surface: {
      900: '#431407',
      800: '#7c2d12',
      700: '#9a3412',
      600: '#c2410c',
    },
    gradient: 'linear-gradient(135deg, #431407 0%, #9a3412 50%, #431407 100%)',
  },

  // 🌸 Rose Pink Theme
  rose: {
    name: 'Rose Pink',
    brand: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
    accent: {
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
    },
    surface: {
      900: '#4c0519',
      800: '#881337',
      700: '#9f1239',
      600: '#be123c',
    },
    gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #4c0519 100%)',
  },

  // 🎯 Deep Purple Theme
  deepPurple: {
    name: 'Deep Purple',
    brand: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    accent: {
      400: '#e9d5ff',
      500: '#d8b4fe',
      600: '#c084fc',
    },
    surface: {
      900: '#3b0764',
      800: '#581c87',
      700: '#6b21a8',
      600: '#7e22ce',
    },
    gradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #3b0764 100%)',
  },
};

// 🎯 SELECT YOUR THEME HERE
const selectedTheme = THEMES.current; // Keep current for black/white with purple

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
        // Use selected theme colors
        ...selectedTheme,
        
        // Keep existing color names for compatibility
        brand: selectedTheme.brand,
        accent: selectedTheme.accent,
        surface: selectedTheme.surface,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': selectedTheme.gradient,
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
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
        // Light mode glass utilities
        '.glass-light': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        },
        '.glass-light-sm': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          'box-shadow': '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        },
      });
    }),
  ],
};
