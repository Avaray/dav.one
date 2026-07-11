import type { AstroIntegration } from 'astro';
import { extname } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { minify } from '@swc/html';

export default function minifyHtml(): AstroIntegration {
  return {
    name: 'minify-html',
    hooks: {
      'astro:build:done': async ({ pages, dir }) => {
        const distDir = fileURLToPath(dir);
        let count = 0;
        let savedBytes = 0;

        await Promise.all(
          pages.map(async (page) => {
            const pagePath = fileURLToPath(new URL(page.pathname, dir));
            const ext = extname(pagePath);
            
            // Only process HTML files
            if (ext !== '.html' && ext !== '') return;
            
            const htmlPath = ext === '' ? `${pagePath}index.html` : pagePath;

            try {
              const html = await readFile(htmlPath, 'utf-8');
              const originalSize = Buffer.byteLength(html, 'utf8');

              const result = await minify(Buffer.from(html), {
                collapseWhitespaces: 'smart',
                removeComments: true,
                minifyCss: true,
                minifyJs: true,
                quotes: true, // IMPORTANT: Prevents stripping quotes from attributes
              });

              const minifiedHtml = result.code;
              const newSize = Buffer.byteLength(minifiedHtml, 'utf8');

              await writeFile(htmlPath, minifiedHtml, 'utf-8');
              
              count++;
              savedBytes += (originalSize - newSize);
            } catch (error) {
              // Ignore errors for files that don't exist (e.g. dynamic routes)
              if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                console.error(`Failed to minify ${htmlPath}:`, error);
              }
            }
          })
        );

        console.log(`\x1b[32m[minify-html]\x1b[0m Minified ${count} HTML files, saved ~${Math.round(savedBytes / 1024)}KB`);
      },
    },
  };
}
