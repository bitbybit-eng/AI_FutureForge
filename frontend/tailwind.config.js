/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forge-cyan': '#00f5ff',
        'forge-orange': '#ff6b35',
        'forge-purple': '#a855f7',
        'forge-green': '#22c55e',
        'forge-yellow': '#f59e0b',
        'forge-bg': '#040810',
        'forge-panel': 'rgba(5,9,18,0.82)',
      },
      fontFamily: {
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 18px #00f5ff55' },
          '50%': { textShadow: '0 0 48px #00f5ffbb, 0 0 90px #00f5ff22' },
        },
      },
    },
  },
  plugins: [],
}
