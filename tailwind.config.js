/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712',
          900: '#0a0f1e',
          800: '#111827',
          700: '#1a2236',
          600: '#243049',
          500: '#2d3a56',
        },
        ai: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          indigo: '#6366f1',
        },
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
        'ai-gradient-subtle': 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1), rgba(6,182,212,0.1))',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59,130,246,0.3)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
