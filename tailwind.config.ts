import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#cfd6de',
          300: '#aab9c6',
          400: '#7f96a8',
          500: '#5f7a90',
          600: '#4b6276',
          700: '#3c4d5e',
          800: '#2e3a47',
          900: '#1f2833',
          950: '#0b1118'
        },
        accent: {
          400: '#6AE3FF',
          500: '#22D3EE',
          600: '#06B6D4'
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 8px 30px rgba(0,0,0,0.6)'
      },
      keyframes: {
        'in-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'in-scale': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        'in-fade': 'in-fade 200ms ease-out',
        'in-scale': 'in-scale 220ms cubic-bezier(0.16,1,0.3,1)'
      }
    }
  },
  plugins: []
} satisfies Config
