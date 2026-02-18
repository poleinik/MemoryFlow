import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Q } from '@nozbe/watermelondb';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import ExpandableFlipCard from 'src/components/ExpandableFlipCard';
import { useTabSwipe } from 'src/hooks/useTabSwipe';
import Card from 'src/model/Cards';
import { StatusCard } from 'src/model/consts';
import { database } from 'src/model';
import { Colors, FontWeights, TextSizes, layout } from 'src/styles';

type RepeatRouteParams = {
  reviewScope?: 'theme';
  themeId?: string;
  reviewRequestId?: number;
};

const ratingButtons = [
  { key: 'again', label: 'Снова', color: '#f43f5e' },
  { key: 'hard', label: 'Сложно', color: '#f59e0b' },
  { key: 'good', label: 'Хорошо', color: Colors.primary },
  { key: 'easy', label: 'Легко', color: Colors.backgroundAccent },
] as const;

export function RepeatScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Repeat');
  const route = useRoute();
  const handledRequestIdRef = useRef<number | null>(null);

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedCardIds, setCompletedCardIds] = useState<Set<string>>(new Set());
  const [autoOpenCard, setAutoOpenCard] = useState(false);

  const fetchCardsForRepeat = useCallback(async () => {
    setIsLoading(true);
    const params = (route.params ?? {}) as RepeatRouteParams;
    const isThemeRequest =
      params.reviewScope === 'theme' &&
      !!params.themeId &&
      !!params.reviewRequestId &&
      handledRequestIdRef.current !== params.reviewRequestId;

    const themeId = isThemeRequest ? params.themeId : undefined;

    if (isThemeRequest && params.reviewRequestId) {
      handledRequestIdRef.current = params.reviewRequestId;
    }

    const cardsCollection = database.get<Card>('cards');
    const scopeConditions = themeId ? [Q.where('theme_id', themeId)] : [];

    const [newCards, dueCards] = await Promise.all([
      cardsCollection
        .query(...scopeConditions, Q.where('status', StatusCard.NEW))
        .fetch(),
      cardsCollection
        .query(...scopeConditions, Q.where('next_review_at', Q.lte(Date.now())))
        .fetch(),
    ]);

    const uniqueCards = new Map<string, Card>();
    [...newCards, ...dueCards].forEach(card => uniqueCards.set(card.id, card));

    const sortedCards = [...uniqueCards.values()].sort((left, right) => {
      const leftTime = left.nextReviewAt?.getTime() ?? Number.MIN_SAFE_INTEGER;
      const rightTime = right.nextReviewAt?.getTime() ?? Number.MIN_SAFE_INTEGER;
      return leftTime - rightTime;
    });

    setCards(sortedCards);
    setAutoOpenCard(Boolean(themeId));
    setCompletedCardIds(new Set());
    setIsLoading(false);
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      fetchCardsForRepeat();
    }, [fetchCardsForRepeat]),
  );

  const pendingCards = useMemo(
    () => cards.filter(card => !completedCardIds.has(card.id)),
    [cards, completedCardIds],
  );

  const currentCard = pendingCards[0];

  const markCardReviewed = (cardId: string) => {
    setCompletedCardIds(previous => {
      const next = new Set(previous);
      next.add(cardId);
      return next;
    });
  };

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <View style={layout.container}>
        <Text style={layout.header2}>Повтор</Text>

        {isLoading ? (
          <View style={styles.centeredBlock}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : null}

        {!isLoading && !currentCard ? (
          <View style={styles.centeredBlock}>
            <Text style={styles.emptyText}>Пока нечего повторять</Text>
          </View>
        ) : null}

        {!isLoading && currentCard ? (
          <View style={styles.contentWrapper}>
            <Text style={styles.counterText}>{pendingCards.length} карточек к повторению</Text>

            <ExpandableFlipCard
              key={currentCard.id}
              autoOpen={autoOpenCard}
              overlayOpacity={0.45}
              aspectRatio={0.72}
              onOpenChange={isOpen => {
                if (isOpen) {
                  setAutoOpenCard(false);
                }
              }}
              renderPreview={({ onPress }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.previewCard}
                  onPress={onPress}
                >
                  <Text style={styles.previewLabel}>Вопрос</Text>
                  <Text style={styles.previewQuestion}>{currentCard.question}</Text>
                  <Text style={styles.previewHint}>Нажмите, чтобы открыть</Text>
                </TouchableOpacity>
              )}
              frontContent={
                <View style={styles.expandedCardFront}>
                  <Text style={styles.expandedLabel}>Вопрос</Text>
                  <Text style={styles.expandedQuestion}>{currentCard.question}</Text>
                  <Text style={styles.flipHint}>Нажмите, чтобы перевернуть</Text>
                </View>
              }
              backContent={
                <View style={styles.expandedCardBack}>
                  <Text style={styles.expandedLabel}>Ответ</Text>
                  <Text style={styles.expandedAnswer}>{currentCard.answer}</Text>
                  <Text style={styles.rateHint}>Как хорошо вы знали ответ?</Text>

                  <View style={styles.ratingGrid}>
                    {ratingButtons.map(button => (
                      <TouchableOpacity
                        key={button.key}
                        activeOpacity={0.9}
                        onPress={() => markCardReviewed(currentCard.id)}
                        style={[styles.ratingButton, { backgroundColor: button.color }]}
                      >
                        <Text style={styles.ratingButtonText}>{button.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              }
            />
          </View>
        ) : null}
      </View>
    </SwipeNavigationView>
  );
}

const styles = StyleSheet.create({
  centeredBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TextSizes.large,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  contentWrapper: {
    flex: 1,
    gap: 12,
  },
  counterText: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  previewCard: {
    ...layout.block,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 16,
    minHeight: 160,
    justifyContent: 'space-between',
    gap: 12,
  },
  previewLabel: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  previewQuestion: {
    ...TextSizes.large,
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  previewHint: {
    ...TextSizes.small,
    color: Colors.textForeground,
  },
  expandedCardFront: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  expandedCardBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    gap: 12,
  },
  expandedLabel: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  expandedQuestion: {
    ...TextSizes.xxlarge,
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  expandedAnswer: {
    ...TextSizes.large,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  flipHint: {
    ...TextSizes.small,
    color: Colors.textForeground,
  },
  rateHint: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  ratingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    flexGrow: 1,
    flexBasis: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonText: {
    ...TextSizes.small,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
});
