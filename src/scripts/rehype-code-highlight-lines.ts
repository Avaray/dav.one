import { visit } from "unist-util-visit";

export interface RehypeCodeHighlightLinesOptions {
  /**
   * CSS class added to every line of code.
   * @default ""
   */
  lineClassName?: string;
  
  /**
   * CSS class for dimmed lines (used only in 'dim-others' mode).
   * @default "darkened"
   */
  darkenedClassName?: string;
  
  /**
   * CSS class for highlighted lines (used only in 'highlight-only' mode).
   * @default "highlighted"
   */
  highlightedClassName?: string;
  
  /**
   * Plugin operation mode:
   * - `'dim-others'`: dims lines that are NOT specified in the brackets.
   * - `'highlight-only'`: adds a highlight class ONLY to the lines specified in the brackets.
   * @default "dim-others"
   */
  mode?: "dim-others" | "highlight-only";
  
  /**
   * Type of brackets used in Markdown to define the line range.
   * - `'square'` -> `[1, 2-4]`
   * - `'curly'` -> `{1, 2-4}`
   * @default "square"
   */
  delimiter?: "square" | "curly";
  
  /**
   * Whether to generate an additional `<span>` tag with the line number at the beginning.
   * @default false
   */
  showLineNumbers?: boolean;
  
  /**
   * CSS class for the generated line number element.
   * @default "line-number"
   */
  lineNumberClassName?: string;

  /**
   * Whether to add a `data-line` attribute to each line span.
   * Useful if you prefer CSS pseudo-element counters over `showLineNumbers`.
   * @default false
   */
  addDataLineAttribute?: boolean;
}

// Default plugin configuration options
const defaultOptions: Required<RehypeCodeHighlightLinesOptions> = {
  lineClassName: "",
  darkenedClassName: "darkened",
  highlightedClassName: "highlighted",
  mode: "dim-others",
  delimiter: "square",
  showLineNumbers: false,
  lineNumberClassName: "line-number",
  addDataLineAttribute: false,
};

function parseLineRanges(meta: string, rangeRegex: RegExp): number[] {
  if (!meta) return [];

  const rangeMatch = meta.match(rangeRegex);
  if (!rangeMatch) return [];

  const rangeString = rangeMatch[1];
  const ranges = rangeString.split(",").map((s) => s.trim());
  const lineNumbers: number[] = [];

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

function createLineSpan(content: string, lineNumber: number, targetLines: number[], options: Required<RehypeCodeHighlightLinesOptions>) {
  const isTarget = targetLines.includes(lineNumber);
  const classNames: string[] = [];
  
  if (options.lineClassName) {
    classNames.push(options.lineClassName);
  }

  // Logic for assigning classes based on the selected mode
  if (options.mode === "dim-others") {
    if (!isTarget && options.darkenedClassName) {
      classNames.push(options.darkenedClassName);
    }
  } else if (options.mode === "highlight-only") {
    if (isTarget && options.highlightedClassName) {
      classNames.push(options.highlightedClassName);
    }
  }

  const children: any[] = [];

  // Optional generation of line number structure
  if (options.showLineNumbers) {
    children.push({
      type: "element",
      tagName: "span",
      properties: { className: [options.lineNumberClassName] },
      children: [{ type: "text", value: String(lineNumber) }],
    });
  }

  // Add the actual content of the code line
  children.push({ type: "text", value: content });

  const properties: any = {};
  if (classNames.length > 0) {
    properties.className = classNames;
  }
  if (options.addDataLineAttribute) {
    properties["data-line"] = lineNumber;
  }

  return {
    type: "element",
    tagName: "span",
    properties: properties,
    children: children,
  };
}

export function rehypeCodeHighlightLines(userOptions: RehypeCodeHighlightLinesOptions = {}) {
  // Merge user options with defaults
  const options = { ...defaultOptions, ...userOptions };

  // Dynamically match delimiter characters
  const openChar = options.delimiter === "curly" ? "{" : "[";
  const closeChar = options.delimiter === "curly" ? "}" : "]";
  
  // Dynamically create regular expression, e.g., /\[(.*?)\]/ or /\{(.*?)\}/
  const rangeRegex = new RegExp(`\\${openChar}(.*?)\\${closeChar}`);
  const pseudoLangPrefix = `language-${openChar}`;

  return function transformer(tree: any) {
    visit(tree, "element", (node: any) => {
      if (node.tagName === "pre") {
        const codeElement = node.children?.find(
          (child: any) => child.type === "element" && child.tagName === "code",
        );

        if (codeElement) {
          let metastring = codeElement.data?.meta ||
            codeElement.properties?.metastring ||
            codeElement.properties?.metaString ||
            codeElement.properties?.["data-meta"] ||
            node.data?.meta ||
            node.properties?.metastring;

          // FALLBACK: The parser treated the brackets as the language due to a missing space
          if (!metastring && codeElement.properties?.className) {
            const classNames = codeElement.properties.className;
            
            if (Array.isArray(classNames)) {
              const pseudoLangMeta = classNames.find(c => 
                typeof c === 'string' && c.startsWith(pseudoLangPrefix) && c.endsWith(closeChar)
              );
              
              if (pseudoLangMeta) {
                metastring = pseudoLangMeta.replace('language-', '');
              }
            }
          }

          if (metastring && typeof metastring === "string" && metastring.includes(openChar)) {
            const targetLines = parseLineRanges(metastring, rangeRegex);

            if (targetLines.length > 0) {
              const textNode = codeElement.children?.find((child: any) => child.type === "text");

              if (textNode && textNode.value) {
                const lines = textNode.value.split("\n");
                const newChildren: any[] = [];

                lines.forEach((line: string, index: number) => {
                  const lineNumber = index + 1;

                  if (index > 0) {
                    newChildren.push({ type: "text", value: "\n" });
                  }

                  newChildren.push(createLineSpan(line, lineNumber, targetLines, options));
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
