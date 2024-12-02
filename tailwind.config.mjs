import typography from '@tailwindcss/typography';
import animation from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {}
    }
  },
  plugins: [animation, typography()]
};
