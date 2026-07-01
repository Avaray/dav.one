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
   * CSS class for targeted inline text ranges (e.g. {1:5-10}).
   * @default "inline-highlighted"
   */
  inlineHighlightedClassName?: string;

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

interface InlineRange {
  start: number;
  end: number;
}

interface LineTarget {
  isFullLine: boolean;
  inlineRanges: InlineRange[];
}

// Default plugin configuration options
const defaultOptions: Required<RehypeCodeHighlightLinesOptions> = {
  lineClassName: "",
  darkenedClassName: "darkened",
  highlightedClassName: "highlighted",
  inlineHighlightedClassName: "inline-highlighted",
  mode: "dim-others",
  delimiter: "square",
  showLineNumbers: false,
  lineNumberClassName: "line-number",
  addDataLineAttribute: false,
};

function parseLineTargets(meta: string, rangeRegex: RegExp): Map<number, LineTarget> {
  const targets = new Map<number, LineTarget>();
  if (!meta) return targets;

  const rangeMatch = meta.match(rangeRegex);
  if (!rangeMatch) return targets;

  const rangeString = rangeMatch[1];
  const ranges = rangeString.split(",").map((s) => s.trim());

  for (const range of ranges) {
    if (range.includes(":")) {
      const [lineStr, charsStr] = range.split(":");
      const lineNum = parseInt(lineStr.trim());
      if (isNaN(lineNum)) continue;

      let startChar, endChar;
      if (charsStr.includes("-")) {
        const [start, end] = charsStr.split("-").map((num) => parseInt(num.trim()));
        startChar = start;
        endChar = end;
      } else {
        startChar = parseInt(charsStr.trim());
        endChar = startChar;
      }

      if (!isNaN(startChar) && !isNaN(endChar)) {
        if (!targets.has(lineNum)) {
          targets.set(lineNum, { isFullLine: false, inlineRanges: [] });
        }
        targets.get(lineNum)!.inlineRanges.push({ start: startChar, end: endChar });
      }
    } else if (range.includes("-")) {
      const [start, end] = range.split("-").map((num) => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (!targets.has(i)) {
            targets.set(i, { isFullLine: true, inlineRanges: [] });
          } else {
            targets.get(i)!.isFullLine = true;
          }
        }
      }
    } else {
      const lineNum = parseInt(range.trim());
      if (!isNaN(lineNum)) {
        if (!targets.has(lineNum)) {
          targets.set(lineNum, { isFullLine: true, inlineRanges: [] });
        } else {
          targets.get(lineNum)!.isFullLine = true;
        }
      }
    }
  }

  // Normalize inline ranges (sort and merge overlaps)
  for (const target of targets.values()) {
    if (target.inlineRanges.length > 0) {
      target.inlineRanges.sort((a, b) => a.start - b.start);
      const merged: InlineRange[] = [];
      for (const r of target.inlineRanges) {
        if (merged.length === 0) {
          merged.push({ ...r });
        } else {
          const last = merged[merged.length - 1];
          if (r.start <= last.end + 1) { // merge overlapping or adjacent
            last.end = Math.max(last.end, r.end);
          } else {
            merged.push({ ...r });
          }
        }
      }
      target.inlineRanges = merged;
    }
  }

  return targets;
}

function createLineSpan(content: string, lineNumber: number, targets: Map<number, LineTarget>, options: Required<RehypeCodeHighlightLinesOptions>) {
  const target = targets.get(lineNumber);
  const isFullLineTarget = target?.isFullLine ?? false;
  const hasInlineTargets = target ? target.inlineRanges.length > 0 : false;

  const classNames: string[] = [];
  
  if (options.lineClassName) {
    classNames.push(options.lineClassName);
  }

  // Logic for assigning classes based on the selected mode
  if (options.mode === "dim-others") {
    // A line is darkened if it's NOT a full line target
    // (Even if it has inline targets, the line itself remains darkened)
    if (!isFullLineTarget && options.darkenedClassName) {
      classNames.push(options.darkenedClassName);
    }
  } else if (options.mode === "highlight-only") {
    // A line gets the line highlight class only if it's a full line target
    if (isFullLineTarget && options.highlightedClassName) {
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
  if (hasInlineTargets && target) {
    let currentIndex = 0; // 0-based index
    for (const r of target.inlineRanges) {
      // 1-based to 0-based index mapping
      const startIndex = Math.max(0, r.start - 1);
      const endIndex = Math.min(content.length, r.end); // exclusive slice boundary is same as 1-based end

      if (startIndex > currentIndex) {
        children.push({ type: "text", value: content.slice(currentIndex, startIndex) });
      }

      if (startIndex < content.length && endIndex > startIndex) {
        children.push({
          type: "element",
          tagName: "span",
          properties: { className: [options.inlineHighlightedClassName] },
          children: [{ type: "text", value: content.slice(startIndex, endIndex) }]
        });
      }
      currentIndex = Math.max(currentIndex, endIndex);
    }
    if (currentIndex < content.length) {
      children.push({ type: "text", value: content.slice(currentIndex) });
    }
  } else {
    children.push({ type: "text", value: content });
  }

  const properties: any = {};
  if (classNames.length > 0) {
    properties.className = classNames;
  }
  if (options.addDataLineAttribute) {
    properties["data-line"] = lineNumber;
  }

  // If the span would have no attributes and no line number element, 
  // simply return the raw text node instead of an empty <span>
  if (Object.keys(properties).length === 0 && !options.showLineNumbers && !hasInlineTargets) {
    return { type: "text", value: content };
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
            const targets = parseLineTargets(metastring, rangeRegex);

            if (targets.size > 0) {
              const textNode = codeElement.children?.find((child: any) => child.type === "text");

              if (textNode && textNode.value) {
                const lines = textNode.value.split("\n");
                const newChildren: any[] = [];

                lines.forEach((line: string, index: number) => {
                  const lineNumber = index + 1;

                  if (index > 0) {
                    newChildren.push({ type: "text", value: "\n" });
                  }

                  newChildren.push(createLineSpan(line, lineNumber, targets, options));
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
