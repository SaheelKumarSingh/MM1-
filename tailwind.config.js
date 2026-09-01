/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        line: 'var(--color-border)',
        'line-strong': 'var(--color-border-strong)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          fg: 'var(--color-accent-fg)',
        },
        critical: {
          DEFAULT: 'var(--color-critical)',
          soft: 'var(--color-critical-soft)',
          border: 'var(--color-critical-border)',
        },
        warn: {
          DEFAULT: 'var(--color-warn)',
          soft: 'var(--color-warn-soft)',
          border: 'var(--color-warn-border)',
        },
        calm: {
          DEFAULT: 'var(--color-calm)',
          soft: 'var(--color-calm-soft)',
          border: 'var(--color-calm-border)',
        },
        ok: {
          DEFAULT: 'var(--color-ok)',
          soft: 'var(--color-ok-soft)',
        },
        // Legacy aliases → theme tokens
        sunrise: {
          50: 'var(--color-accent-soft)',
          100: 'var(--color-accent-soft)',
          200: 'var(--color-accent-soft)',
          300: 'var(--color-accent)',
          400: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent)',
          700: 'var(--color-accent)',
          800: 'var(--color-accent)',
          900: 'var(--color-accent)',
          950: 'var(--color-accent-soft)',
        },
        dark: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          surfaceHover: 'var(--color-accent-soft)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          borderLight: 'var(--color-border-strong)',
          muted: 'var(--color-muted)',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'urgency-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.72' },
        },
      },
      animation: {
        'urgency-pulse': 'urgency-pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
