## 🧻 My Blog

[![Cloudflare Pages Deployment](https://github.com/Avaray/dav.one/actions/workflows/deploy.yml/badge.svg)](https://github.com/Avaray/dav.one/actions/workflows/deploy.yml)
[![Cloudflare Pages Deployment](https://github.com/Avaray/dav.one/actions/workflows/deploy.yml/badge.svg?branch=next)](https://github.com/Avaray/dav.one/actions/workflows/deploy.yml)

Blog about Stable Diffusion, Generative AI, Web Development, Frontend Frameworks and Programming in general.

Developed with [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/).\
Built using [Astro](https://astro.build/) framework.\
Styled with [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/).\
Deployed with [GitHub Actions](https://github.com/features/actions).\
Hosted with [Cloudflare Pages](https://pages.cloudflare.com/).

## 📑 Changelog (V1 -> V2)

Key changes worth to mention

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

## 📆 Upcoming plans

- [ ] Make this project 100% Deno based. Currently package for SVG icons is not compatible with Deno and it is blocking
      me.
- [ ] Do something cool with code blocks and Syntax Highlighting. I really want to avoid remark/rehype plugins.

## 🐣 How to run this project

Clone this repository

```
git clone https://github.com/Avaray/dav.one.git
```

Navigate to the project directory

```
cd dav.one
```

Install dependencies

```
deno task install
```

Start development server

```
deno task dev
```

## ✨ Themes

Currently theme switch component is disabled because I have just one theme. Rest of themes are experimental (not ready
for production). However, you can switch themes with `CTRL` + `Arrow Keys` combination.

## ©️ Copyright

All articles and documents are licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).\
License is located in `LICENSE.md` file.
