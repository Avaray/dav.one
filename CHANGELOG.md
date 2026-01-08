# Changelog

## 📑 v2.2

- Replaced
  [TailwindCSS Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography)
  with my own typography plugin
  [Clampography](https://www.npmjs.com/package/clampography?activeTab=versions).
  The fact that TailwindCSS Typography applies styles and later you have to
  struggle to overwrite them forced me to work on my own project.
- Added some new components to keep code DRY.

## 📑 v2.1

- Replaced
  [Tailwind CSS Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography)
  with [Clampography](https://www.npmjs.com/package/clampography).
- Replaced logo with a new design due to licensing constraints. The previous
  logo used a commercial font that required a paid license for sites exceeding
  5000 monthly visitors. New font is
  [Crunchy Time](https://www.dafont.com/crunchy-time.font).

## 📑 v1 -> v2

- Updated to Tailwind CSS V4
- Updated daisyUI to V5
- Did many changes in layout and design
- Created new components (mostly related to images)
- Updated standalone pages (about me, about website, etc)
- Created one new article
- Switched to Deno (from Node+PNPM)
- Updated Vite to v6
- Added prefetching for most of pages

Removed:

- UnoCSS stuff (except web-fonts preset)
- Biome
- Preact
- Nanostores
- Rehype plugins
