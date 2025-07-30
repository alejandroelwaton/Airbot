// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-fg)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
};

export default config;
