import {
  defineConfig,
  presetUno,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
} from 'unocss';

export const fontList = {
  firamono: 'Fira Mono:400',
  gotu: 'Gotu:400',
  quando: 'Quando:400',
  // victormono: 'Victor Mono:400,200,100', // Nice font, but not sure if I want to use it
};

export default defineConfig({
  presets: [
    presetUno(),
    transformerDirectives,
    presetIcons({
      // scale: 1.2,
      scale: 1,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      customizations: {},
    }),
    presetWebFonts({
      provider: 'google',
      fonts: fontList,
    }),
  ],
  transformers: [],
  rules: [],
  shortcuts: [],
});
