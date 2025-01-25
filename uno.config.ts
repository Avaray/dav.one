import { defineConfig } from 'unocss';
import { presetWebFonts } from 'unocss';

export const fontList = {
  firamono: 'Fira Mono:400',
  gotu: 'Gotu:400',
  quando: 'Quando:400',
  victormono: 'Victor Mono:400,200,100', // Nice font, but not sure if I want to use it
  // New for tests
  ptserif: 'PT Serif:400',
  notoserif: 'Noto Serif:400',
  spectral: 'Spectral:200,300,400',
  shipporimincho: 'Shippori Mincho:400',
};

export default defineConfig({
  presets: [
    presetWebFonts({
      provider: 'google',
      fonts: fontList
    })
  ],
  transformers: [],
  rules: [],
  shortcuts: [],
})
