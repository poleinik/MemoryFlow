import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Animated, PanResponder } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontWeights, layout, TextSizes } from 'src/styles';
import ArrowBackIcon from 'assets/ArrowBackIcon';
import TrashIcon from 'assets/TrashIcon';
import { useGetTheme } from '../../hooks/useGetTheme';
import { Progress } from './components/Progress';
import { AICreateBtn } from './components/AICreation';
import { Portal } from 'react-native-portalize';
import { Modal, ModalHandle } from 'src/components/Modal';
import TouchableScale from 'src/components/TouchableScale';
import { CreateCardModal } from './CreateCardModal';
import PlayIcon from 'assets/PlayIcon';
import PlusIcon from 'assets/PlusIcon';
import { CardComponent } from './components/CardComponent';
import ExpandableCard from 'src/components/ExpandableCard';
import FlipCard from 'src/components/FlipCard';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { StatusCard } from 'src/model/consts';
import { useDeleteCard } from 'src/api/useDeleteCard';
import { useDeleteTheme } from 'src/api/useDeleteTheme';
export type ThemeStackParamList = {
  ThemeMain: undefined;
  ThemeDetail: { id: string };
};


type Props = NativeStackScreenProps<ThemeStackParamList, 'ThemeDetail'>;

const DELETE_ZONE_HEIGHT = 72;

export const ThemeDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { theme, cards, fetch } = useGetTheme();
  const { deleteCard } = useDeleteCard();
  const { deleteTheme } = useDeleteTheme();
  const modalRef = useRef<ModalHandle>(null);
  const openModal = () => modalRef?.current?.openModal();
  const closeModal = () => modalRef?.current?.closeModal();

  useFocusEffect(
    useCallback(() => {
      fetch(id);
    }, [fetch, id]),
  );

  // ── Drag-to-delete state ──
  const isDraggingRef = useRef(false);
  const panGrantedRef = useRef(false);
  const draggingItemRef = useRef<{ id: string; question: string } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isOverDeleteRef = useRef(false);
  const [isOverDelete, setIsOverDelete] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const deleteZoneOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const containerRef = useRef<View>(null);
  const containerPageY = useRef(0);
  const containerHeight = useRef(0);
  const startDx = useRef(0);
  const startDy = useRef(0);

  const deleteCardRef = useRef(deleteCard);
  deleteCardRef.current = deleteCard;
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;
  const idRef = useRef(id);
  idRef.current = id;

  const resetDrag = useCallback(() => {
    isDraggingRef.current = false;
    panGrantedRef.current = false;
    draggingItemRef.current = null;
    isOverDeleteRef.current = false;
    setDraggingId(null);
    setScrollEnabled(true);
    setIsOverDelete(false);
    translateX.setValue(0);
    translateY.setValue(0);
    cardScale.setValue(1);
    deleteZoneOpacity.setValue(0);
  }, [translateX, translateY, cardScale, deleteZoneOpacity]);

  const resetDragRef = useRef(resetDrag);
  resetDragRef.current = resetDrag;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: () => isDraggingRef.current,
        onMoveShouldSetPanResponderCapture: () => {
          if (isDraggingRef.current) {
            panGrantedRef.current = true;
            return true;
          }
          return false;
        },
        onPanResponderGrant: (_evt, gestureState) => {
          panGrantedRef.current = true;
          startDx.current = gestureState.dx;
          startDy.current = gestureState.dy;
        },
        onPanResponderMove: (evt, gestureState) => {
          translateX.setValue(gestureState.dx - startDx.current);
          translateY.setValue(gestureState.dy - startDy.current);

          const fingerY = evt.nativeEvent.pageY;
          const relY = fingerY - containerPageY.current;
          const over = relY > containerHeight.current - DELETE_ZONE_HEIGHT;
          if (over !== isOverDeleteRef.current) {
            isOverDeleteRef.current = over;
            setIsOverDelete(over);
          }
        },
        onPanResponderRelease: evt => {
          const fingerY = evt.nativeEvent.pageY;
          const relY = fingerY - containerPageY.current;
          const over = relY > containerHeight.current - DELETE_ZONE_HEIGHT;

          if (over && draggingItemRef.current) {
            const item = { ...draggingItemRef.current };
            resetDragRef.current();
            Alert.alert(
              'Удалить карточку',
              `Удалить карточку «${item.question}»?`,
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Удалить',
                  style: 'destructive',
                  onPress: async () => {
                    await deleteCardRef.current(item.id);
                    await fetchRef.current(idRef.current);
                  },
                },
              ],
            );
          } else {
            Animated.parallel([
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                friction: 6,
              }),
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 6,
              }),
              Animated.spring(cardScale, {
                toValue: 1,
                useNativeDriver: true,
              }),
              Animated.timing(deleteZoneOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start(() => {
              resetDragRef.current();
            });
          }
        },
        onPanResponderTerminate: () => {
          resetDragRef.current();
        },
        onShouldBlockNativeResponder: () => true,
        onPanResponderTerminationRequest: () => false,
      }),
    [translateX, translateY, cardScale, deleteZoneOpacity],
  );

  const handleCardLongPress = useCallback(
    (cardItem: { id: string; question: string }) => {
      isDraggingRef.current = true;
      panGrantedRef.current = false;
      draggingItemRef.current = { id: cardItem.id, question: cardItem.question };
      setDraggingId(cardItem.id);
      setScrollEnabled(false);
      translateX.setValue(0);
      translateY.setValue(0);

      containerRef.current?.measureInWindow((_x, y, _w, h) => {
        containerPageY.current = y;
        containerHeight.current = h;
      });

      Animated.parallel([
        Animated.timing(deleteZoneOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1.05,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [translateX, translateY, deleteZoneOpacity, cardScale],
  );

  const handleCardPressOut = useCallback(() => {
    if (isDraggingRef.current && !panGrantedRef.current) {
      Animated.timing(deleteZoneOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => resetDrag());
    }
  }, [deleteZoneOpacity, resetDrag]);


  const totalCards = cards?.length ?? 0;
  const completedCards = useMemo(
    () =>
      (cards ?? []).filter(
        card =>
          (card.status as (typeof StatusCard)[keyof typeof StatusCard]) ===
          StatusCard.MASTERED,
      ).length,
    [cards],
  );

  const handleSwipeBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleStartRepeat = () => {
    const parentNavigation = navigation.getParent();
    if (!parentNavigation) {
      return;
    }

    (parentNavigation as any).navigate('Repeat', {
      reviewScope: 'theme',
      themeId: id,
      reviewRequestId: Date.now(),
    });
  };

  const handleDeleteTheme = () => {
    Alert.alert(
      'Удалить тему',
      `Вы уверены, что хотите удалить тему «${theme?.title}»? Все карточки будут удалены.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteTheme(id);
            navigation.goBack();
          },
        },
      ],
    );
  };


  return (
    <SwipeNavigationView onSwipeRight={handleSwipeBack}>
      <View
        ref={containerRef}
        style={layout.container}
        {...panResponder.panHandlers}
      >
        <ScrollView
          style={{ flex: 1, margin: -16 }}
          contentContainerStyle={{ padding: 16, gap: 24 }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[3]}
          scrollEnabled={scrollEnabled}
        >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <ArrowBackIcon color={Colors.textForeground} />
            <Text>Назад</Text>
          </TouchableOpacity>
          <TouchableScale
            activeScale={0.85}
            onPress={handleDeleteTheme}
            style={{ padding: 8 }}
          >
            <TrashIcon width={22} height={22} color={Colors.backgroundAccent4} />
          </TouchableScale>
        </View>
        <View>
          <Text style={layout.header1}>{theme?.title}</Text>
          <Text style={{ ...TextSizes.small, color: Colors.textForeground }}>
            {theme?.description}
          </Text>
        </View>

        <Progress total={totalCards} completed={completedCards} />

        <View style={stickyStyles.stickyRow}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableScale
            style={{
              ...layout.block,
              flexDirection: 'row',
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleStartRepeat}
          >
            <PlayIcon width={20} height={20} color="white" />
            <Text
              style={{
                marginLeft: 8,
                color: Colors.textSecondary,
                fontWeight: FontWeights.semibold,
                flexShrink: 1,
                ...TextSizes.medium,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Повторять
            </Text>
          </TouchableScale>

          <TouchableScale
            style={{
              ...layout.block,
              flexDirection: 'row',
              backgroundColor: Colors.backgroundSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => openModal()}
          >
            <PlusIcon color={Colors.textPrimary} />
            <Text
              style={{
                marginLeft: 8,
                color: Colors.textPrimary,
                fontWeight: FontWeights.semibold,
                flexShrink: 1,
                ...TextSizes.medium,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Добавить карточку
            </Text>
          </TouchableScale>
          </View>
        </View>

        <View>
          <Text style={layout.header3}>Карточки</Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {(cards ?? []).length === 0 ? (
              <Text style={{ ...TextSizes.small, color: Colors.textForeground }}>
                Пока нет карточек
              </Text>
            ) : (
              (cards ?? []).map(item => {
                const cardStatus =
                  item.status as (typeof StatusCard)[keyof typeof StatusCard];
                const isDraggingThis = draggingId === item.id;

                return (
                  <Animated.View
                    key={String(item.id)}
                    style={
                      isDraggingThis
                        ? {
                            transform: [
                              { translateX },
                              { translateY },
                              { scale: cardScale },
                            ],
                            zIndex: 999,
                            elevation: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          }
                        : undefined
                    }
                  >
                  <ExpandableCard
                    renderPreview={({ onPress }) => (
                      <CardComponent
                        id={String(item.id)}
                        question={item.question}
                        answer={item.answer}
                        status={cardStatus}
                        nextReviewAt={item.nextReviewAt}
                        onPress={() => {
                          if (!isDraggingRef.current) {
                            onPress();
                          }
                        }}
                        onLongPress={() => handleCardLongPress({ id: item.id, question: item.question })}
                        onPressOut={handleCardPressOut}
                      />
                    )}
                    renderExpandedContent={({ cardWidth, cardHeight }) => (
                      <FlipCard
                        style={{ width: cardWidth, height: cardHeight }}
                        frontContent={
                          <CardComponent
                            id={String(item.id)}
                            question={item.question}
                            answer={item.answer}
                            status={cardStatus}
                            nextReviewAt={item.nextReviewAt}
                            mode="expanded"
                            showAnswer={false}
                          />
                        }
                        backContent={
                          <CardComponent
                            id={String(item.id)}
                            question={item.question}
                            answer={item.answer}
                            status={cardStatus}
                            nextReviewAt={item.nextReviewAt}
                            mode="expanded"
                            showAnswer={true}
                          />
                        }
                      />
                    )}
                  />
                  </Animated.View>
                );
              })
            )}
          </View>
        </View>
        </ScrollView>

        {/* Delete zone — overlays at bottom when dragging */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: DELETE_ZONE_HEIGHT,
            backgroundColor: isOverDelete
              ? 'rgba(239, 68, 68, 0.85)'
              : 'rgba(254, 226, 226, 0.75)',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            opacity: deleteZoneOpacity,
            zIndex: 998,
          }}
        >
          <TrashIcon
            width={24}
            height={24}
            color={isOverDelete ? 'white' : '#ef4444'}
          />
          <Text
            style={{
              color: isOverDelete ? 'white' : '#ef4444',
              fontWeight: FontWeights.semibold,
              ...TextSizes.medium,
            }}
          >
            Перетащите сюда
          </Text>
        </Animated.View>

        {/* Плавающая кнопка для генерации карточек с ИИ */}
       <AICreateBtn />
        <Portal>
          <Modal ref={modalRef}>
            <CreateCardModal closeModal={closeModal} />
          </Modal>
        
        </Portal>
      </View>
    </SwipeNavigationView>
  );
};

const stickyStyles = StyleSheet.create({
  stickyRow: {
    backgroundColor: Colors.backgroundPrimary,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
