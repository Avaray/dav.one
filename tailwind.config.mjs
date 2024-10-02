import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import { customThemes } from './src/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './astro.config.mjs'],
  theme: {
    colors: {},
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {},
        },
        md: {
          css: {
            h1: {
              fontSize: '2.25em',
              lineHeight: '1.2',
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: '2.3em',
              lineHeight: '1.3',
            },
          },
        },
        xl: {
          css: {
            h1: {
              fontSize: '2.4em',
              lineHeight: '1.35',
            },
          },
        },
      }),
    },
  },

  plugins: [typography(), daisyui],
  daisyui: {
    themes: customThemes, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
};
