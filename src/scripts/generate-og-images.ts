import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { chromium } from 'playwright';

const articlesDir = join(process.cwd(), 'src', 'articles');
const publicDir = join(process.cwd(), 'public');

async function main() {
  if (process.env.GITHUB_REF_NAME && process.env.GITHUB_REF_NAME !== 'main') {
    console.log('Skipping OG image generation on non-main branch.');
    return;
  }

  console.log('Starting OG image generation...');
  const articles = await readdir(articlesDir, { withFileTypes: true });
  
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.GITHUB_ACTIONS ? "/usr/bin/google-chrome" : undefined,
  });
  console.log('Creating new page...');
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });
  console.log('Browser ready. Iterating articles...');

  for (const dirent of articles) {
    if (!dirent.isDirectory()) continue;
    
    const slug = dirent.name;
    const mdxPath = join(articlesDir, slug, 'index.mdx');
    
    let content;
    try {
      content = await readFile(mdxPath, 'utf8');
    } catch (e) {
      continue; // Skip if no index.mdx
    }
    
    if (/draft:\s*true/i.test(content)) {
      console.log(`Skipping draft: ${slug}`);
      continue;
    }
    
    const iconMatch = content.match(/icon:\s*['"]([^'"]+)['"]/);
    if (!iconMatch) {
      console.log(`No icon found for: ${slug}`);
      continue;
    }
    
    const [prefix, name] = iconMatch[1].split(':');
    const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg`;
    
    const targetDir = join(publicDir, slug);
    await mkdir(targetDir, { recursive: true });
    
    const outPath = join(targetDir, 'og.jpg');
    const hashPath = join(targetDir, 'og.hash');
    
    const dataToHash = svgUrl + "oklch(76% 0.177 163.223)"; // Dodano kolor do hasha na wypadek zmiany motywu
    const hash = createHash('md5').update(dataToHash).digest('hex');
    
    let existingHash = '';
    try { existingHash = await readFile(hashPath, 'utf8'); } catch(e) {}
    
    if (existingHash === hash) {
      console.log(`Skipping (cached): ${slug}`);
      continue;
    }
    
    console.log(`Fetching icon for ${slug}: ${svgUrl}`);
    const svgRes = await fetch(svgUrl);
    if (!svgRes.ok) {
      console.error(`Failed to fetch SVG for ${slug}`);
      continue;
    }
    
    let svgContent = await svgRes.text();
    // Force single color (currentColor) overriding existing colors
    svgContent = svgContent.replace(/fill="[^"]+"/g, (match) => match === 'fill="none"' ? match : 'fill="currentColor"');
    svgContent = svgContent.replace(/stroke="[^"]+"/g, (match) => match === 'stroke="none"' ? match : 'stroke="currentColor"');
    // Replace SVG root element width/height to fill container, while keeping viewbox
    svgContent = svgContent.replace('<svg ', '<svg style="width:100%; height:100%;" ');
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: oklch(16.77% 0.01 252.43);
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1200px;
              height: 630px;
            }
            .icon-container {
              height: 75vh;
              color: oklch(76% 0.177 163.223); /* primary color */
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <div class="icon-container">
            ${svgContent}
          </div>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    await writeFile(hashPath, hash);
    
    console.log(`Generated OG image for: ${slug}`);
  }
  
  await browser.close();
  console.log('OG image generation complete!');
}

main().catch(console.error);
