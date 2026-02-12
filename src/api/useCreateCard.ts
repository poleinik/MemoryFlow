import { useCallback } from 'react';
import { database } from 'src/model';
import Card from 'src/model/Cards';
import { StatusCardTheme } from 'src/model/consts';

export const useCreateCard = () => {
    const createCard = useCallback(
        async (props: { question: string; answer: string; themeId: string }) => {
            return await database.write(async () => {
                const created = await database.get<Card>('cards').create(card => {
                    card.themeId = props.themeId;
                    card.question = props.question;
                    card.answer = props.answer;
                    card.status = StatusCardTheme.NEW;
                    card.repetitions = 0;
                    card.interval = 0;
                    card.easeFactor = 2.5;
                    card.createdAt = new Date();
                    card.nextReviewAt = null;
                    card.isNotificationSended = false;
                });

                return created;
            });
        },
        [],
    );

    return { createCard };
};