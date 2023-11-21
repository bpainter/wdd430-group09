import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          base: '#002E5D', // BYU Blue
          light: '#3E5B99', // Lighter shade of BYU Blue
          dark: '#001F40', // Darker shade of BYU Blue
        },
        secondary: {
          base: '#FFFFFF', // White for contrast
          light: '#F2F2F2', // Light gray as secondary light
          dark: '#D1D1D1', // Dark gray as secondary dark
        },
        gray: {
          lightest: '#F7F7F7',
          lighter: '#E1E1E1',
          light: '#CFCFCF',
          base: '#B1B1B1',
          dark: '#939393',
          darker: '#757575',
          darkest: '#575757',
        },
        alert: {
          info: '#1E90FF',
          success: '#28A745',
          warning: '#FFC107',
          danger: '#DC3545',
        },
      },
      screens: {
        sm: '640px',
        m: '768px',
        l: '1024px',
        xl: '1280px',
        xxl: '1536px',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        heading: ['Inter var', 'sans-serif'],
        body: ['Inter var', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem', // 1 * 0.25 = 0.25rem (4px)
        s: '0.5rem',   // 2 * 0.25 = 0.5rem (8px)
        m: '1rem',     // 4 * 0.25 = 1rem (16px)
        l: '2rem',     // 8 * 0.25 = 2rem (32px)
        xl: '4rem',    // 16 * 0.25 = 4rem (64px)
        xxl: '8rem',   // 32 * 0.25 = 8rem (128px)
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        basd: '0.25rem',
        m: '0.375rem',
        l: '0.5rem',
        full: '9999px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config
