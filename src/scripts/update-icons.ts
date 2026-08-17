import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const MDX_FILE = path.join(process.cwd(), 'src', 'pages', 'attribution', 'index.mdx');

async function walk(dir: string, fileList: string[] = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await walk(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  const files = await walk(SRC_DIR);
  const iconRegex = /icon(?:=|:\s*)["']([a-z0-9-]+:[a-z0-9-]+)["']/gi;
  const collections = new Set<string>();

  for (const file of files) {
    if (!/\.(astro|tsx|jsx|ts|js|mdx|md)$/.test(file)) continue;
    const content = await fs.readFile(file, 'utf-8');
    let match;
    while ((match = iconRegex.exec(content)) !== null) {
      const iconString = match[1];
      const collection = iconString.split(':')[0];
      collections.add(collection);
    }
  }

  console.log('Found collections:', Array.from(collections));

  // Fetch collection data from Iconify
  const response = await fetch('https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json');
  const allCollections = await response.json();

  const generatedLines = [
    'The majority of the icons used on this website are open-source, accessed primarily via [Iconify](https://iconify.design/). These include collections such as:',
    ''
  ];

  for (const collection of Array.from(collections).sort()) {
    const data = allCollections[collection];
    if (data) {
      const name = data.name;
      const url = data.author?.url || `https://icon-sets.iconify.design/${collection}/`;
      const licenseName = data.license?.title || 'Unknown License';
      const licenseUrl = data.license?.url || '';
      
      let licenseText = licenseName;
      if (licenseUrl) {
        licenseText = `[${licenseName}](${licenseUrl})`;
      }
      
      generatedLines.push(`* **[${name}](${url})**: Licensed under ${licenseText}`);
    } else {
      generatedLines.push(`* **${collection}**: Collection details not found on Iconify.`);
    }
  }

  generatedLines.push('');
  generatedLines.push('I am neither the creator nor the owner of any of these icons. All rights, including trademarks, remain with their respective authors and maintainers.');

  const generatedContent = generatedLines.join('\n');

  // Replace in MDX file
  const mdxContent = await fs.readFile(MDX_FILE, 'utf-8');
  const startMarker = '{/* ICONS-START */}';
  const endMarker = '{/* ICONS-END */}';

  const startIndex = mdxContent.indexOf(startMarker);
  const endIndex = mdxContent.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const newMdxContent = mdxContent.substring(0, startIndex + startMarker.length) + '\n' + generatedContent + '\n' + mdxContent.substring(endIndex);
    await fs.writeFile(MDX_FILE, newMdxContent, 'utf-8');
    console.log('Successfully updated attribution page.');
  } else {
    console.error('Could not find ICONS-START or ICONS-END markers in attribution file.');
  }
}

main().catch(console.error);
