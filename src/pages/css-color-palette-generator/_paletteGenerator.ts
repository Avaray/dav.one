import type { LockedColor } from "./_types.ts";
import { generateRandomColor, getContrastRatio, hexToRgb } from "./_colorUtils.ts";

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const generatePalette = (count: number, lockedColors: LockedColor[] = []): string[] => {
  const colors: (string | null)[] = [];

  for (let i = 0; i < count; i++) {
    if (lockedColors[i]?.locked) {
      colors.push(lockedColors[i].color);
    } else {
      colors.push(null);
    }
  }

  if (colors[0] === null) {
    colors[0] = Math.random() > 0.5 ? generateRandomColor(0.15, 0.25) : generateRandomColor(0.85, 0.95);
  }

  const bgLuminance = getLuminance(colors[0]!);
  const isBrightBg = bgLuminance > 0.5;

  if (colors[1] === null) {
    let attempts = 0;
    do {
      colors[1] = isBrightBg ? generateRandomColor(0.15, 0.25) : generateRandomColor(0.85, 0.95);
      attempts++;
    } while (getContrastRatio(colors[0]!, colors[1]) < 7 && attempts < 50);
  }

  for (let i = 2; i < count; i++) {
    if (colors[i] === null) {
      let attempts = 0;
      do {
        colors[i] = generateRandomColor(0.4, 0.7);
        attempts++;
      } while (getContrastRatio(colors[0]!, colors[i]!) < 3 && attempts < 50);
    }
  }

  return colors as string[];
};
