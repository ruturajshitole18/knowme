/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0A071E",
          subtle: "#0F0B29",
          card: "#140F35",
          hover: "#1B1545",
        },
        primary: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
          glow: "#A78BFA",
        },
        secondary: {
          DEFAULT: "#EC4899",
          foreground: "#FFFFFF",
          glow: "#F472B6",
        },
        accent: {
          DEFAULT: "#38BDF8",
          foreground: "#FFFFFF",
          glow: "#7DD3FC",
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
