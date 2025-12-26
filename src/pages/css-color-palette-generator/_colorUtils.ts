import type { Oklab, P3, RGB } from "./_Types.ts";

export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

export const rgbToOklab = (r: number, g: number, b: number): Oklab => {
  const toLinear = (c: number): number => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
};

export const oklabToRgb = (L: number, a: number, b: number): RGB => {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toSrgb = (c: number): number => {
    c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, c)) * 255;
  };

  return {
    r: toSrgb(lr),
    g: toSrgb(lg),
    b: toSrgb(lb),
  };
};

export const rgbToP3 = (r: number, g: number, b: number): P3 => {
  const toLinear = (c: number): number => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  return {
    r: lr * 100,
    g: lg * 100,
    b: lb * 100,
  };
};

export const generateRandomColor = (minL = 0.3, maxL = 0.9): string => {
  const L = minL + Math.random() * (maxL - minL);
  const a = (Math.random() - 0.5) * 0.4;
  const b = (Math.random() - 0.5) * 0.4;

  const rgb = oklabToRgb(L, a, b);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const formatColor = (hex: string, format: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  switch (format) {
    case "HEX":
      return hex.toUpperCase();
    case "RGB":
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    case "OKLAB": {
      const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
      return `oklab(${(oklab.L * 100).toFixed(2)}% ${oklab.a.toFixed(4)} ${oklab.b.toFixed(4)})`;
    }
    case "P3": {
      const p3 = rgbToP3(rgb.r, rgb.g, rgb.b);
      return `color(display-p3 ${(p3.r / 100).toFixed(4)} ${(p3.g / 100).toFixed(4)} ${(p3.b / 100).toFixed(4)})`;
    }
    default:
      return hex;
  }
};
