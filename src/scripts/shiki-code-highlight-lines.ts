import type { ShikiTransformer } from 'shiki';

export interface ShikiCodeHighlightLinesOptions {
  /**
   * CSS class added to every line of code.
   * @default "code-line"
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
}

interface InlineRange {
  start: number;
  end: number;
}

interface LineTarget {
  isFullLine: boolean;
  inlineRanges: InlineRange[];
}

const defaultOptions: Required<ShikiCodeHighlightLinesOptions> = {
  lineClassName: "code-line",
  darkenedClassName: "darkened",
  highlightedClassName: "highlighted",
  inlineHighlightedClassName: "inline-highlighted",
  mode: "dim-others",
  delimiter: "square",
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
          if (r.start <= last.end + 1) {
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

/**
 * Recursively extract the full plain text from a Shiki HAST node tree.
 */
function extractText(node: any): string {
  if (node.type === "text") return node.value ?? "";
  if (node.children) return node.children.map(extractText).join("");
  return "";
}

export function shikiCodeHighlightLines(userOptions: ShikiCodeHighlightLinesOptions = {}): ShikiTransformer {
  const options = { ...defaultOptions, ...userOptions };
  const openChar = options.delimiter === "curly" ? "{" : "[";
  const closeChar = options.delimiter === "curly" ? "}" : "]";
  const rangeRegex = new RegExp(`\\${openChar}(.*?)\\${closeChar}`);

  return {
    name: "shiki-code-highlight-lines",

    pre(node: any) {
      const metaRaw: string = this.options.meta?.__raw ?? "";
      const currentTargets = parseLineTargets(metaRaw, rangeRegex);

      if (currentTargets.size > 0) {
        this.addClassToHast(node, "has-highlighted");
      }
    },

    line(node: any, lineNum: number) {
      const metaRaw: string = this.options.meta?.__raw ?? "";
      const currentTargets = parseLineTargets(metaRaw, rangeRegex);

      if (options.lineClassName) {
        this.addClassToHast(node, options.lineClassName);
      }

      const target = currentTargets.get(lineNum);
      const isFullLineTarget = target?.isFullLine ?? false;
      const hasInlineTargets = target ? target.inlineRanges.length > 0 : false;

      if (currentTargets.size > 0) {
        if (options.mode === "dim-others") {
          if (!isFullLineTarget && options.darkenedClassName) {
            this.addClassToHast(node, options.darkenedClassName);
          }
        } else if (options.mode === "highlight-only") {
          if (isFullLineTarget && options.highlightedClassName) {
            this.addClassToHast(node, options.highlightedClassName);
          }
        }
      }

      // Handle inline character-level highlights
      if (hasInlineTargets && target) {
        const fullText = extractText(node);
        const newChildren: any[] = [];
        let currentIndex = 0;

        for (const r of target.inlineRanges) {
          const startIndex = Math.max(0, r.start - 1);
          const endIndex = Math.min(fullText.length, r.end);

          if (startIndex > currentIndex) {
            newChildren.push({ type: "text", value: fullText.slice(currentIndex, startIndex) });
          }

          if (startIndex < fullText.length && endIndex > startIndex) {
            newChildren.push({
              type: "element",
              tagName: "span",
              properties: { className: [options.inlineHighlightedClassName] },
              children: [{ type: "text", value: fullText.slice(startIndex, endIndex) }],
            });
          }
          currentIndex = Math.max(currentIndex, endIndex);
        }
        if (currentIndex < fullText.length) {
          newChildren.push({ type: "text", value: fullText.slice(currentIndex) });
        }

        node.children = newChildren;
      }
    },
  };
}
