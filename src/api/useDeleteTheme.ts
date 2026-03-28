import { useCallback } from 'react';
import { database } from 'src/model';
import { Q } from '@nozbe/watermelondb';
import Theme from 'src/model/Themes';
import Card from 'src/model/Cards';
import ReviewLog from 'src/model/ReviewLog';

export const useDeleteTheme = () => {
  const deleteTheme = useCallback(async (themeId: string) => {
    await database.write(async () => {
      const theme = await database.get<Theme>('themes').find(themeId);
      const cards = await database
        .get<Card>('cards')
        .query(Q.where('theme_id', themeId))
        .fetch();
      const reviewLogs = await database
        .get<ReviewLog>('review_log')
        .query(Q.where('theme_id', themeId))
        .fetch();

      const batch = [
        ...reviewLogs.map(log => log.prepareDestroyPermanently()),
        ...cards.map(card => card.prepareDestroyPermanently()),
        theme.prepareDestroyPermanently(),
      ];

      await database.batch(...batch);
    });
  }, []);

  return { deleteTheme };
};
