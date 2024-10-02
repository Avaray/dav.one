// import { atom } from "nanostores";
import { persistentAtom } from '@nanostores/persistent';

// import { customThemesList } from "./themes";

export type SettingsType = {
  theme: string;
};

export const settingsDefaultAtom: SettingsType = {
  theme: 'dark',
};

export const $settingsAtom = persistentAtom<SettingsType>(
  'settings-v0-0-2',
  { ...settingsDefaultAtom },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const set = <T extends keyof SettingsType>(key: T, value: SettingsType[T]) => {
  $settingsAtom.set({ ...$settingsAtom.get(), [key]: value });
};
