import type { ShikiTransformer } from 'shiki';
import type { Element, ElementContent, Text } from 'hast';

/**
 * Extends Shiki's official per-run state bag (`this.meta` inside transformer hooks)
 * with our own cache. Populated once in `preprocess()` - which always runs before
 * any `line()`/`pre()` call - and reused by every `line()` call for the same code
 * block, instead of re-parsing the meta string on every single line.
 */
declare module 'shiki' {
  interface ShikiTransformerContextMeta {
    __highlightLinesCache?: {
      targets: Map<number, LineTarget>;
      wordPatterns: RegExp[];
    };
  }
}

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
   * CSS class for text matched by a word/regex pattern (e.g. /useState/).
   * Applies across the whole code block, regardless of line number.
   * @default "word-highlighted"
   */
  wordHighlightedClassName?: string;

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
  /** CSS class applied to this specific range (lets different range sources coexist). */
  className: string;
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
  wordHighlightedClassName: "word-highlighted",
  mode: "dim-others",
  delimiter: "square",
};

/**
 * Sorts and merges overlapping/adjacent ranges that share the same className.
 * Ranges with different classNames are never merged into each other, so distinct
 * highlight sources (e.g. explicit char ranges vs. word/regex matches) keep their
 * own styling instead of being blended into one span.
 */
function mergeRanges(ranges: InlineRange[]): InlineRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: InlineRange[] = [{ ...sorted[0] }];

  for (const r of sorted.slice(1)) {
    const last = merged[merged.length - 1];
    if (r.className === last.className && r.start <= last.end + 1) {
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ ...r });
    }
  }

  return merged;
}

/** True if two 1-based inclusive character ranges overlap at all. */
function rangesOverlap(a: InlineRange, b: InlineRange): boolean {
  return a.start <= b.end && b.start <= a.end;
}

function parseLineTargets(
  meta: string,
  rangeRegex: RegExp,
  inlineHighlightedClassName: string,
): Map<number, LineTarget> {
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
        targets.get(lineNum)!.inlineRanges.push({
          start: startChar,
          end: endChar,
          className: inlineHighlightedClassName,
        });
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

  // Normalize inline ranges (sort and merge overlaps within the same class)
  for (const target of targets.values()) {
    if (target.inlineRanges.length > 0) {
      target.inlineRanges = mergeRanges(target.inlineRanges);
    }
  }

  return targets;
}

/**
 * Extracts every `/pattern/flags` token from the meta string (e.g. `/useState/`
 * or case-insensitive `/error/i`). Independent of the line-range syntax, so it
 * works whether or not `[...]`/`{...}` ranges are also present.
 */
function parseWordPatterns(meta: string): RegExp[] {
  const patterns: RegExp[] = [];
  if (!meta) return patterns;

  const wordPatternRegex = /\/((?:\\\/|[^/])+)\/([a-zA-Z]*)/g;
  let match: RegExpExecArray | null;

  while ((match = wordPatternRegex.exec(meta)) !== null) {
    const [, rawPattern, flags] = match;
    const pattern = rawPattern.replace(/\\\//g, "/");
    const normalizedFlags = flags.includes("g") ? flags : `${flags}g`;

    try {
      patterns.push(new RegExp(pattern, normalizedFlags));
    } catch {
      // Invalid regex supplied in the meta string - skip it rather than failing the build.
    }
  }

  return patterns;
}

/**
 * Runs every word/regex pattern against a single line's plain text and returns
 * the (merged) set of matched character ranges, tagged with `className`.
 */
function findWordMatchRanges(lineText: string, patterns: RegExp[], className: string): InlineRange[] {
  const raw: InlineRange[] = [];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(lineText)) !== null) {
      if (match[0].length === 0) {
        // Avoid an infinite loop on zero-width matches (e.g. `/x*/`).
        pattern.lastIndex++;
        continue;
      }
      raw.push({ start: match.index + 1, end: match.index + match[0].length, className });
    }
  }

  return mergeRanges(raw);
}

/**
 * Recursively extract the full plain text from a Shiki HAST node tree.
 */
function extractText(node: Element | ElementContent): string {
  if (node.type === "text") return (node as Text).value ?? "";
  if ("children" in node && node.children) {
    return node.children.map(extractText).join("");
  }
  return "";
}

export function shikiCodeHighlightLines(userOptions: ShikiCodeHighlightLinesOptions = {}): ShikiTransformer {
  const options = { ...defaultOptions, ...userOptions };
  const openChar = options.delimiter === "curly" ? "{" : "[";
  const closeChar = options.delimiter === "curly" ? "}" : "]";
  const rangeRegex = new RegExp(`\\${openChar}(.*?)\\${closeChar}`);

  return {
    name: "shiki-code-highlight-lines",

    preprocess() {
      // If the language starts and ends with our delimiters (e.g., "[2]" or "{2-3}")
      // it means the user forgot to specify the language and the parser took line numbers as the language.
      if (this.options.lang && this.options.lang.startsWith(openChar) && this.options.lang.endsWith(closeChar)) {
        this.options.meta = this.options.meta || {};
        this.options.meta.__raw = `${this.options.lang} ${this.options.meta.__raw || ''}`.trim();
        this.options.lang = 'plaintext';
      }

      // Parse the meta string exactly once per code block. `preprocess()` always runs
      // before `line()`/`pre()`, so every later hook can just read this instead of
      // re-parsing the same meta string on every single line.
      const metaRaw: string = this.options.meta?.__raw ?? "";
      this.meta.__highlightLinesCache = {
        targets: parseLineTargets(metaRaw, rangeRegex, options.inlineHighlightedClassName),
        wordPatterns: parseWordPatterns(metaRaw),
      };
    },

    pre(node: Element) {
      const { targets: currentTargets, wordPatterns } = this.meta.__highlightLinesCache ?? {
        targets: new Map<number, LineTarget>(),
        wordPatterns: [],
      };

      if (currentTargets.size > 0 || wordPatterns.length > 0) {
        this.addClassToHast(node, "has-highlighted");
      }
    },

    line(node: Element, lineNum: number) {
      const { targets: currentTargets, wordPatterns } = this.meta.__highlightLinesCache ?? {
        targets: new Map<number, LineTarget>(),
        wordPatterns: [],
      };

      if (options.lineClassName) {
        this.addClassToHast(node, options.lineClassName);
      }

      const target = currentTargets.get(lineNum);
      const isFullLineTarget = target?.isFullLine ?? false;

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

      // Handle inline character-level highlights: explicit {line:start-end} ranges
      // plus /word/regex/ matches, combined without breaking either feature.
      const explicitRanges = target?.inlineRanges ?? [];

      if (explicitRanges.length === 0 && wordPatterns.length === 0) {
        return;
      }

      const fullText = extractText(node);

      const wordRanges = wordPatterns.length > 0
        ? findWordMatchRanges(fullText, wordPatterns, options.wordHighlightedClassName).filter(
            (wordRange) => !explicitRanges.some((explicitRange) => rangesOverlap(wordRange, explicitRange)),
          )
        : [];

      const allRanges = [...explicitRanges, ...wordRanges].sort((a, b) => a.start - b.start);

      if (allRanges.length === 0) {
        return;
      }

      const newChildren: ElementContent[] = [];
      let currentIndex = 0;

      for (const r of allRanges) {
        const startIndex = Math.max(0, r.start - 1);
        const endIndex = Math.min(fullText.length, r.end);

        if (startIndex > currentIndex) {
          newChildren.push({ type: "text", value: fullText.slice(currentIndex, startIndex) });
        }

        if (startIndex < fullText.length && endIndex > startIndex) {
          newChildren.push({
            type: "element",
            tagName: "span",
            properties: { className: [r.className] },
            children: [{ type: "text", value: fullText.slice(startIndex, endIndex) }],
          });
        }
        currentIndex = Math.max(currentIndex, endIndex);
      }
      if (currentIndex < fullText.length) {
        newChildren.push({ type: "text", value: fullText.slice(currentIndex) });
      }

      node.children = newChildren;
    },
  };
}
