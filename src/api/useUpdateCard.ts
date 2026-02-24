import { useCallback } from 'react';
import { database } from 'src/model';
import Card from 'src/model/Cards';
import { StatusCard } from 'src/model/consts';

type UpdateCardPayload = {
  id: string;
  question?: string;
  answer?: string;
  status?: (typeof StatusCard)[keyof typeof StatusCard];
  nextReviewAt?: Date | null;
  repetitions?: number;
  interval?: number;
  easeFactor?: number;
  isNotificationSended?: boolean;
};

export const useUpdateCard = () => {
  const updateCard = useCallback(async (payload: UpdateCardPayload) => {
    return await database.write(async () => {
      const card = await database.get<Card>('cards').find(payload.id);

      await card.update(record => {
        if (payload.question !== undefined) {
          record.question = payload.question;
        }
        if (payload.answer !== undefined) {
          record.answer = payload.answer;
        }
        if (payload.status !== undefined) {
          record.status = payload.status;
        }
        if (payload.nextReviewAt !== undefined) {
          record.nextReviewAt = payload.nextReviewAt;
        }
        if (payload.repetitions !== undefined) {
          record.repetitions = payload.repetitions;
        }
        if (payload.interval !== undefined) {
          record.interval = payload.interval;
        }
        if (payload.easeFactor !== undefined) {
          record.easeFactor = payload.easeFactor;
        }
        if (payload.isNotificationSended !== undefined) {
          record.isNotificationSended = payload.isNotificationSended;
        }
      });

      return card;
    });
  }, []);

  return { updateCard };
};
