import Theme from 'src/model/Themes';
import Card from 'src/model/Cards';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
type ThemeState = {
  theme: Theme | null;
  cards: Array<Card>;
  setTheme: (theme: Theme | null) => void;
  setCards: (cards: Array<Card>) => void;
};
const useStore = create<ThemeState>(set => ({
  theme: null,
  cards: [],
  setTheme: (theme: Theme | null) => set({ theme }),
  setCards: (cards: Array<Card>) => set({ cards }),
}));

export const useThemeStore = () =>
  useStore(
    useShallow(s => ({
      theme: s.theme,
      setTheme: s.setTheme,
    })),
  );

export const useCardsStore = () =>
  useStore(
    useShallow(s => ({
      cards: s.cards,
      setCards: s.setCards,
    })),
  );
