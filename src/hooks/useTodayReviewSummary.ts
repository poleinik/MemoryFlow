import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Q } from '@nozbe/watermelondb';
import { database } from 'src/model';
import Card from 'src/model/Cards';
import User from 'src/model/User';
import { StatusCard } from 'src/model/consts';

type TodayReviewSummary = {
  pendingReviewCount: number;
  userName: string | null;
};

const getUniqueReviewCount = (cards: Card[]) => {
  return new Set(cards.map(card => card.id)).size;
};

export function useTodayReviewSummary() {
  const [summary, setSummary] = useState<TodayReviewSummary>({
    pendingReviewCount: 0,
    userName: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);

    const cardsCollection = database.get<Card>('cards');
    const userCollection = database.get<User>('user');

    const [users, newCards, dueCards] = await Promise.all([
      userCollection.query().fetch(),
      cardsCollection.query(Q.where('status', StatusCard.NEW)).fetch(),
      cardsCollection.query(Q.where('next_review_at', Q.lte(Date.now()))).fetch(),
    ]);

    const userName = users[0]?.name?.trim() || null;
    const pendingReviewCount = getUniqueReviewCount([...newCards, ...dueCards]);

    setSummary({ pendingReviewCount, userName });
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [fetchSummary]),
  );

  return {
    ...summary,
    isLoading,
    refresh: fetchSummary,
  };
}