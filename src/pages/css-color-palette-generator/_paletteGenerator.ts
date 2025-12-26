import type { LockedColor } from "./_types.ts";
import { generateRandomColor, getContrastRatio } from "./_colorUtils.ts";

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

  const isDarkBg = getContrastRatio("#ffffff", colors[0]!) < 2;

  if (colors[1] === null) {
    let attempts = 0;
    do {
      colors[1] = isDarkBg ? generateRandomColor(0.85, 0.95) : generateRandomColor(0.15, 0.25);
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
