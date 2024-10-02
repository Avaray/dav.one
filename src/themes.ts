import themes from 'daisyui/src/theming/themes.js';
export const officialThemesList: string[] = Object.keys(themes);

// const defaultFontFamily = 'Verdana, Avenir, sans-serif, ui-sans-serif, system-ui';
// const defaultFontFamily = 'Fira Mono';

export const customThemes: (string | Record<string, Record<string, string>>)[] = [
  {
    lean_green: {
      ...themes.forest,
      fontFamily: 'Fira Mono',
    },
  },
  {
    redemption: {
      'color-scheme': 'dark',
      primary: '#fa5555',
      neutral: '#28323e',
      'base-100': '#242424',
      fontFamily: 'Quando',
    },
  },
  {
    midnight_chill: {
      'color-scheme': 'light',
      primary: '#A06CD5',
      neutral: '#28323e',
      'base-100': '#380c5a',
      'base-content': '#A06CD5',
      fontFamily: 'Quando',
    },
  },
  {
    colorless: {
      'color-scheme': 'light',
      'base-100': '#fefefe',
      primary: '#252525',
      'base-content': '#252525',
      fontFamily: 'Quando',
    },
  },
  {
    synthwave: {
      ...themes.synthwave,
      fontFamily: 'Quando',
    },
  },
  {
    da_ba_dee: {
      ...themes.night,
      fontFamily: 'Fira Mono',
    },
  },
  {
    caffe_crema: {
      ...themes.coffee,
      'base-content': '#f2d4b8',
      fontFamily: 'Quando',
    },
  },
];

// Icons have to be in a separate variable because DaisyUI doesn't allow adding custom keys to the theme object
// This list is not used in the app. I was considering using it to display icons in the theme selection dropdown
export const icons: Record<string, string> = {
  light: 'i-game-icons:focused-lightning',
  dark: 'i-game-icons:slumbering-sanctuary',
  aqua: 'i-game-icons:dripping-tube',
  cmyk: 'i-ion:color-filter',
  corporate: 'i-game-icons:companion-cube',
  cupcake: 'i-game-icons:cupcake',
  dracula: 'i-game-icons:vampire-dracula',
  forest: 'i-game-icons:pine-tree',
  lofi: 'i-game-icons:broken-wall',
  pastel: 'i-game-icons:cat',
  retro: 'i-simple-icons:retroarch',
  synthwave: 'i-game-icons:psychic-waves',
  night: 'i-solar:moon-sleep-bold',
  coffee: 'i-fluent:drink-coffee-16-filled',
};

export const customThemesList: string[] = customThemes.map((theme) => Object.keys(theme)[0] || '');
