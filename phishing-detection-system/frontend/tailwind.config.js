/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F14',
        foreground: '#F8FAFC',
        primary: {
          DEFAULT: '#FFFFFF',
          foreground: '#0B0F14',
        },
        accent: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          orange: '#F97316',
          cyan: '#06B6D4',
        },
        card: {
          DEFAULT: 'rgba(15, 23, 42, 0.4)',
          foreground: '#F8FAFC',
        },
        border: 'rgba(255, 255, 255, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
