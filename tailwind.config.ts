import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: '#34734b',
        moss: '#6f8f47',
        cream: '#f8f2e7',
        soil: '#5f3b24',
        turmeric: '#e0a12b'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(52, 115, 75, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
