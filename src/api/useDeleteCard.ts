import { useCallback } from 'react';
import { database } from 'src/model';
import { Q } from '@nozbe/watermelondb';
import Card from 'src/model/Cards';
import ReviewLog from 'src/model/ReviewLog';

export const useDeleteCard = () => {
  const deleteCard = useCallback(async (cardId: string) => {
    await database.write(async () => {
      const card = await database.get<Card>('cards').find(cardId);
      const reviewLogs = await database
        .get<ReviewLog>('review_log')
        .query(Q.where('card_id', cardId))
        .fetch();

      const batch = [
        ...reviewLogs.map(log => log.prepareDestroyPermanently()),
        card.prepareDestroyPermanently(),
      ];

      await database.batch(...batch);
    });
  }, []);

  return { deleteCard };
};
