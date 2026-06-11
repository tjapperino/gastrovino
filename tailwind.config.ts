import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Officiële Gastrovino huisstijl (Brand Book 2026):
        // Roomwit #FBF1DB · Diep Terracotta #71413D · Goudbeige #B39662
        cream: {
          DEFAULT: '#FBF1DB',
          dark:    '#F4E6C9',
          darker:  '#EAD8B4',
        },
        // 'olive' is het historische token voor de primaire accentkleur;
        // in de huisstijl is dat Diep Terracotta.
        olive: {
          light:   '#8B5A55',
          DEFAULT: '#71413D',
          dark:    '#5A322F',
          deeper:  '#3E2220',
        },
        terracotta: {
          light:   '#8B5A55',
          DEFAULT: '#71413D',
          dark:    '#5A322F',
          deeper:  '#3E2220',
        },
        gold: {
          light:   '#C9B287',
          DEFAULT: '#B39662',
          dark:    '#94794A',
          // legacy amber shades (BorrelplankBuilder)
          300:     '#D3BF99',
          400:     '#B39662',
          500:     '#9A7F4F',
        },
        ink: {
          subtle:  '#A08A77',
          muted:   '#6A564E',
          DEFAULT: '#241B18',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans:  ['var(--font-sans)',  'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in':   'slideIn  0.35s ease-out',
        'fade-in':    'fadeIn   0.25s ease-out',
        'fade-up':    'fadeUp   0.45s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'warm-sm': '0 1px 4px rgba(44,36,22,0.08)',
        'warm':    '0 2px 12px rgba(44,36,22,0.10)',
        'warm-lg': '0 8px 32px rgba(44,36,22,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
