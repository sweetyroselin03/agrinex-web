export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: '#071226',
        bgSec: '#0B1730',
        primary: '#10B981',
        cyan: '#22D3EE',
        purple: '#7C3AED',
        textMain: '#F8FAFC',
        textSec: '#94A3B8',
        card: 'rgba(255,255,255,0.06)',
        borderDark: 'rgba(255,255,255,0.08)',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
