import { useCallback } from 'react';
import { database } from 'src/model';
import type Card from 'src/model/Cards';
import Theme from 'src/model/Themes';
import { useCardsStore, useThemeStore } from 'src/store/useThemeStore';

export const useGetTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const { cards, setCards } = useCardsStore();

  const fetchThemeById = useCallback(
    async (id: string): Promise<{ theme: Theme; cards: Card[] }> => {
      const theme = await database.get<Theme>('themes').find(id);

      // `@children('cards')` returns a Watermelon Query, not an array.
      // `.fetch()` materializes the query and applies the theme_id scope.
      const cards = await theme.cards.fetch();
      console.log('Карточки, связанные с темой', cards);
      return { theme, cards };
    },
    [],
  );

  const fetch = useCallback(
    async (id: string) => {
      console.log('fetching theme by id...', id);
      const fetchedTheme = await fetchThemeById(id);
      setTheme(fetchedTheme.theme);
      setCards(fetchedTheme.cards);
    },
    [setTheme, setCards],
  );

  return { theme, cards, fetch };
};
