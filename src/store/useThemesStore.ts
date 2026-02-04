import Theme from 'src/model/Themes';
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow';
 type ThemeState = {
  themes: Array<Theme>;
  setThemes: (themes: Array<Theme>) => void;
}
const useStore = create<ThemeState>((set) => ({
  themes: [],
  setThemes: (themes: Array<Theme>) => set({ themes }),
}))

export const useThemesStore = () => useStore(useShallow(s => ({
  themes: s.themes,
  setThemes: s.setThemes,
})));
