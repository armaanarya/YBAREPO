import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        yba: {
          bg: '#09090f',
          surface: '#111118',
          alt: '#0d0d14',
          dark: '#eeeeff',
          cta: '#eeeeff',
          'cta-text': '#09090f',
          muted: 'rgba(238,238,255,0.5)',
          chip: 'rgba(238,238,255,0.08)',
          accent: '#eeeeff',
          border: 'rgba(238,238,255,0.1)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
