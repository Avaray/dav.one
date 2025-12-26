export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

export interface P3 {
  r: number;
  g: number;
  b: number;
}

export interface LockedColor {
  locked: boolean;
  color: string;
}

export interface PaletteState {
  colors: string[];
  names: string[];
  count: number;
}

export interface StorageData {
  colors: string[];
  colorNames: string[];
  lockedColors: LockedColor[];
  colorCount: number;
  format: ColorFormat;
}

export type ColorFormat = "OKLAB" | "P3" | "HEX" | "RGB";
