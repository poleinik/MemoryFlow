import {
  getTodayGreetingFallback,
  getTodayGreetingCacheKey,
  pluralizeReviewCards,
} from 'src/utils/todayGreeting';

describe('todayGreeting helpers', () => {
  test('pluralizes review cards in Russian', () => {
    expect(pluralizeReviewCards(1)).toBe('карточка');
    expect(pluralizeReviewCards(2)).toBe('карточки');
    expect(pluralizeReviewCards(5)).toBe('карточек');
    expect(pluralizeReviewCards(21)).toBe('карточка');
  });

  test('builds fallback message with name and pending card count', () => {
    const message = getTodayGreetingFallback({
      pendingReviewCount: 7,
      userName: 'Анна',
    });

    expect(message).toContain('Анна');
    expect(message).toContain('7 карточек');
    expect(message).toContain('повторения');
  });

  test('praises user when there are no cards left', () => {
    const message = getTodayGreetingFallback({
      pendingReviewCount: 0,
      userName: null,
    });

    expect(message).toContain('карточек больше не осталось');
    expect(message).toContain('Отличная работа');
  });

  test('changes cache key when review count changes', () => {
    const firstKey = getTodayGreetingCacheKey({
      pendingReviewCount: 30,
      userName: 'Анна',
    });
    const secondKey = getTodayGreetingCacheKey({
      pendingReviewCount: 25,
      userName: 'Анна',
    });
    const sameCountKey = getTodayGreetingCacheKey({
      pendingReviewCount: 30,
      userName: 'Анна',
    });

    expect(firstKey).not.toBe(secondKey);
    expect(firstKey).toBe(sameCountKey);
  });
});