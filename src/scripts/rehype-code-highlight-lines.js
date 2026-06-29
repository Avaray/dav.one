// This plugin highlights specific lines in code blocks.
// It works with or without specifying the code block language.

import { visit } from "unist-util-visit";

function parseLineRanges(meta) {
  if (!meta) return [];

  const rangeMatch = meta.match(/\[(.*?)\]/);
  if (!rangeMatch) return [];

  const rangeString = rangeMatch[1];
  const ranges = rangeString.split(",").map((s) => s.trim());
  const lineNumbers = [];

  for (const range of ranges) {
    if (range.includes("-")) {
      const [start, end] = range.split("-").map((num) => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          lineNumbers.push(i);
        }
      }
    } else {
      const lineNum = parseInt(range.trim());
      if (!isNaN(lineNum)) {
        lineNumbers.push(lineNum);
      }
    }
  }

  return lineNumbers.sort((a, b) => a - b);
}

function createLineSpan(content, lineNumber, excludedLines) {
  const isDarkened = !excludedLines.includes(lineNumber);

  return {
    type: "element",
    tagName: "span",
    properties: {
      className: isDarkened ? ["code-line", "darkened"] : ["code-line"],
      "data-line": lineNumber,
    },
    children: [{ type: "text", value: content }],
  };
}

export function rehypeCodeHighlightLines() {
  return function transformer(tree) {
    visit(tree, "element", (node) => {
      if (node.tagName === "pre") {
        const codeElement = node.children?.find(
          (child) => child.type === "element" && child.tagName === "code",
        );

        if (codeElement) {
          let metastring = codeElement.data?.meta ||
            codeElement.properties?.metastring ||
            codeElement.properties?.metaString ||
            codeElement.properties?.["data-meta"] ||
            node.data?.meta ||
            node.properties?.metastring;

          // FALLBACK: Sprawdzenie klas, jeśli parser potraktował nawiasy jako nazwę języka
          if (!metastring && codeElement.properties?.className) {
            const classNames = codeElement.properties.className;
            
            // rehype przechowuje klasy jako tablicę ciągów znaków
            if (Array.isArray(classNames)) {
              const pseudoLangMeta = classNames.find(c => 
                typeof c === 'string' && c.startsWith('language-[') && c.endsWith(']')
              );
              
              if (pseudoLangMeta) {
                // Zamienia np. "language-[1, 2-4]" na "[1, 2-4]"
                metastring = pseudoLangMeta.replace('language-', '');
              }
            }
          }

          if (metastring && typeof metastring === "string" && metastring.includes("[")) {
            const excludedLines = parseLineRanges(metastring);

            if (excludedLines.length > 0) {
              const textNode = codeElement.children?.find((child) => child.type === "text");

              if (textNode && textNode.value) {
                const lines = textNode.value.split("\n");
                const newChildren = [];

                lines.forEach((line, index) => {
                  const lineNumber = index + 1;

                  if (index > 0) {
                    newChildren.push({ type: "text", value: "\n" });
                  }

                  newChildren.push(createLineSpan(line, lineNumber, excludedLines));
                });

                codeElement.children = newChildren;
              }
            }
          }
        }
      }
    });
  };
}

export default rehypeCodeHighlightLines;
