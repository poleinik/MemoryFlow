import { useCallback } from 'react';
import { database } from 'src/model';
import Card from 'src/model/Cards';
import { StatusCardTheme } from 'src/model/consts';

type CardInput = {
    question: string;
    answer: string;
};

export const useCreateCards = () => {
    const createCards = useCallback(
        async (props: { cards: CardInput[]; themeId: string }) => {
            return await database.write(async () => {
                const batch = props.cards.map(item =>
                    database.get<Card>('cards').prepareCreate(card => {
                        card.themeId = props.themeId;
                        card.question = item.question;
                        card.answer = item.answer;
                        card.status = StatusCardTheme.NEW;
                        card.repetitions = 0;
                        card.interval = 0;
                        card.easeFactor = 2.5;
                        card.createdAt = new Date();
                        card.nextReviewAt = null;
                        card.isNotificationSended = false;
                    }),
                );

                await database.batch(...batch);
                return batch;
            });
        },
        [],
    );

    return { createCards };
};
