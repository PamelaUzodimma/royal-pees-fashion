import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#D4AF37',
          dark: '#AA820A',
        },
        charcoal: {
          DEFAULT: '#111111',
          2: '#1A1A1A',
          3: '#2A2A2A',
        },
        surface: '#F9F9F6',
        muted: '#8E8E93',
        border: '#E5E5EA',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
