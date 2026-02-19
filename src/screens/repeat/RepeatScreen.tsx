import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import XIcon from 'assets/XIcon';
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
  const navigation = useNavigation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;

  const route = useRoute();
  const handledRequestIdRef = useRef<number | null>(null);

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedCardIds, setCompletedCardIds] = useState<Set<string>>(new Set());
  const [autoOpenCard, setAutoOpenCard] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [reviewHeaderHeight, setReviewHeaderHeight] = useState(0);

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
      setIsCardExpanded(true);
      fetchCardsForRepeat();

      return () => {
        setIsCardExpanded(false);
        setIsCardFlipped(false);
      };
    }, [fetchCardsForRepeat]),
  );

  const pendingCards = useMemo(
    () => cards.filter(card => !completedCardIds.has(card.id)),
    [cards, completedCardIds],
  );

  const currentCard = pendingCards[0];
  const totalCardsCount = cards.length;
  const completedCount = completedCardIds.size;
  const currentCardNumber = Math.min(completedCount + 1, totalCardsCount);
  const progress = totalCardsCount > 0 ? completedCount / totalCardsCount : 0;

  useEffect(() => {
    setIsCardFlipped(false);
  }, [currentCard?.id]);

  const markCardReviewed = (cardId: string) => {
    setIsCardFlipped(false);
    setCompletedCardIds(previous => {
      const next = new Set(previous);
      next.add(cardId);
      return next;
    });
  };

  const handleClosePress = () => {
    setIsCardExpanded(false);
    setIsCardFlipped(false);
    navigation.goBack();
  };

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setReviewHeaderHeight(height);
  };

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <View style={layout.container}>

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
            <View style={styles.reviewHeader} onLayout={handleHeaderLayout}>
              <View style={styles.reviewHeaderTopRow}>
                <TouchableOpacity
                  onPress={handleClosePress}
                  style={styles.closeButton}
                  activeOpacity={0.8}
                >
                  <XIcon color={Colors.textForeground} width={20} height={20} />
                </TouchableOpacity>

                <View style={styles.reviewHeaderCenter}>
                  <Text style={styles.reviewHeaderTitle}>{currentCardNumber} / {totalCardsCount}</Text>
                  <Text style={styles.reviewHeaderSubtitle}>{pendingCards.length} карточек к повторению</Text>
                </View>

                <View style={styles.closeButtonSpacer} />
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>

            <ExpandableFlipCard
              key={currentCard.id}
              autoOpen={autoOpenCard}
              isExpanded={isCardExpanded}
              isFlipped={isCardFlipped}
              hidePreviewWhenOpen
              showBackdrop={false}
              expandedTopInset={reviewHeaderHeight + 8}
              overlayOpacity={0.45}
              width={isLandscape ? '98%' : '90%'}
              aspectRatio={isLandscape ? 1.08 : 0.72}
              expandedContentPlacement={isLandscape ? 'side' : 'bottom'}
              onOpenChange={isOpen => {
                setIsCardExpanded(isOpen);
                if (isOpen) {
                  setAutoOpenCard(false);
                }
              }}
              
              onFlipChange={setIsCardFlipped}
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
                  <View style={styles.expandedLabelContainer}>
                  <Text style={styles.expandedLabel}>Ответ</Text></View>
                  <Text style={styles.expandedAnswer}>{currentCard.answer}</Text>
                </View>
              }
              expandedBottomContent={
                isCardFlipped ? (
                  <View style={styles.ratingContent}>
                    <Text style={styles.rateHint}>Как хорошо вы знали ответ?</Text>
                    <View style={[styles.ratingGrid, isLandscape && styles.ratingGridLandscape]}>
                      {ratingButtons.map(button => (
                        <TouchableOpacity
                          key={button.key}
                          activeOpacity={0.9}
                          onPress={() => markCardReviewed(currentCard.id)}
                          style={[
                            styles.ratingButton,
                            isLandscape && styles.ratingButtonLandscape,
                            { backgroundColor: button.color },
                          ]}
                        >
                          <Text style={styles.ratingButtonText}>{button.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : null
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
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
    gap: 12,
  },
  counterText: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  reviewHeader: {
    gap: 8,
  },
  reviewHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonSpacer: {
    width: 32,
    height: 32,
  },
  reviewHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  reviewHeaderTitle: {
    ...TextSizes.large,
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  reviewHeaderSubtitle: {
    ...TextSizes.small,
    color: Colors.textForeground,
  },
  progressTrack: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.borderColor,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 999,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    gap: 12,
  },
  expandedCardBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundLight7,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    gap: 12,
  },
  expandedLabelContainer: {
    backgroundColor: Colors.backgroundAccent,
    paddingHorizontal: 12,  
    paddingVertical: 4,
    borderRadius: 50,
  },
  expandedLabel: {
    ...TextSizes.xsmall,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
  expandedQuestion: {
    ...TextSizes.xxlarge,
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
  expandedAnswer: {
    ...TextSizes.large,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
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
  ratingContent: {
    gap: 8,
  },
  ratingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingGridLandscape: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '100%',
  },
  ratingButton: {
    flexGrow: 1,
    flexBasis: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonLandscape: {
    flexGrow: 0,
    flexBasis: 'auto',
    width: '100%',
  },

  ratingButtonText: {
    ...TextSizes.small,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
});
