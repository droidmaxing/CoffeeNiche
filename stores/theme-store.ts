import { create } from "zustand";

export type ThemeSettings = {
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
};

type ThemeState = {
  settings: ThemeSettings;
  setSettings: (settings: Partial<ThemeSettings>) => void;
  reset: () => void;
};

const defaultTheme: ThemeSettings = {
  name: "CoffeeNiche",
  tagline: "Fresh coffee, warm mood",
  logo: "☕",
  primaryColor: "#7c4a2d",
  accentColor: "#f4e9dc",
};

export const useThemeStore = create<ThemeState>()((set) => ({
  settings: defaultTheme,
  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
  reset: () => set({ settings: defaultTheme }),
}));
