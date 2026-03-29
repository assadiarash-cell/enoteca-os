import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#07070D',
          secondary: '#0D0D15',
          tertiary: '#14141F',
          quaternary: '#1C1C2A',
        },
        accent: {
          primary: '#C9843A',
          secondary: '#D4A05A',
          wine: '#8B1A32',
          'wine-light': '#B83250',
        },
        semantic: {
          success: '#22C68A',
          warning: '#E5A832',
          danger: '#DC4545',
          info: '#3B7FD9',
        },
        text: {
          primary: '#EEECE7',
          secondary: '#A09E96',
          tertiary: '#6B6963',
          disabled: '#3D3B37',
        },
      },
      fontFamily: {
        display: ['SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
        body: ['SF Pro Text', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        hero: ['34px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '1.18', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-3': ['18px', { lineHeight: '1.22', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.50', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.40', letterSpacing: '0.02em', fontWeight: '500' }],
        overline: ['11px', { lineHeight: '1.30', letterSpacing: '0.12em', fontWeight: '600' }],
        'mono-sm': ['13px', { lineHeight: '1.40', fontWeight: '400' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.4)',
        md: '0 4px 12px rgba(0,0,0,0.5)',
        lg: '0 8px 32px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
