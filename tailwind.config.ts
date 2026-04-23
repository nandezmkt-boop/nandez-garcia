import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        bg3:     'var(--bg3)',
        border:  'var(--border)',
        text:    'var(--text)',
        muted:   'var(--muted)',
        subtle:  'var(--subtle)',
        accent:  'var(--accent)',
        accent2: 'var(--accent2)',
      },
      fontFamily: {
        head: ['var(--font-head)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        card:    '12px',
        'card-lg': '16px',
        'card-xl': '20px',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
