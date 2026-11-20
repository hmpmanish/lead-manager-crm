/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        charcoal: '#0F172A',
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E', // Forest-teal primary accent
          800: '#115E59',
          900: '#134E4A',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
};
