import {
  View,
  Text,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import EmptyThemesIcon from 'assets/EmptyThemesIcon';
import { Colors, TextSizes, FontWeights } from 'src/styles';
import PlusIcon from 'assets/PlusIcon';
import TrashIcon from 'assets/TrashIcon';
import TouchableScale from 'src/components/TouchableScale';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Modal, ModalHandle } from 'src/components/Modal';
import { CreateThemeModal } from '../CreateThemeModal';
import { ThemeCard } from '../ThemeCard';
import { useGetThemes } from 'src/hooks/useGetThemes';
import { useNavigation } from '@react-navigation/native';
import { useDeleteTheme } from 'src/api/useDeleteTheme';
import todayBoardStyles from '../TodayBoard/styles';
import type Theme from 'src/model/Themes';
import { Q } from '@nozbe/watermelondb';
import { database } from 'src/model';
import type Card from 'src/model/Cards';
import { StatusCard } from 'src/model/consts';

const DELETE_ZONE_HEIGHT = 72;

type ThemeBoardProps = {
  onScrollEnabledChange?: (isEnabled: boolean) => void;
};


const TAB_BAR_HEIGHT = 60;

const fetchProgressMap = async (themes: Theme[]): Promise<Record<string, number>> => {
  if (themes.length === 0) return {};
  const themeIds = themes.map(t => t.id);
  const allCards = await database
    .get<Card>('cards')
    .query(Q.where('theme_id', Q.oneOf(themeIds)))
    .fetch();
  const map: Record<string, number> = {};
  for (const theme of themes) {
    const themeCards = allCards.filter(c => c.themeId === theme.id);
    const total = themeCards.length;
    const mastered = themeCards.filter(c => c.status === StatusCard.MASTERED).length;
    map[theme.id] = total > 0 ? mastered / total : 0;
  }
  return map;
};

export function ThemeBoard({ onScrollEnabledChange }: ThemeBoardProps) {
  const navigation = useNavigation();
  const { themes, fetch } = useGetThemes();
  const { deleteTheme } = useDeleteTheme();
  const insets = useSafeAreaInsets();
  const tabBarOffset = TAB_BAR_HEIGHT + insets.bottom;
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetchProgressMap(themes).then(setProgressMap);
  }, [themes]);

  const modalRef = useRef<ModalHandle>(null);
  const openModal = () => modalRef?.current?.openModal();
  const closeModal = () => modalRef?.current?.closeModal();

  // ── Drag-to-delete state ──
  const isDraggingRef = useRef(false);
  const panGrantedRef = useRef(false);
  const draggingItemRef = useRef<{ id: string; title: string } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
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

  // Stable refs for callbacks used inside PanResponder
  const deleteThemeRef = useRef(deleteTheme);
  deleteThemeRef.current = deleteTheme;
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;

  const updateScrollEnabled = useCallback(
    (isEnabled: boolean) => {
      onScrollEnabledChange?.(isEnabled);
    },
    [onScrollEnabledChange],
  );

  const resetDrag = useCallback(() => {
    isDraggingRef.current = false;
    panGrantedRef.current = false;
    draggingItemRef.current = null;
    isOverDeleteRef.current = false;
    setDraggingId(null);
    updateScrollEnabled(true);
    setIsOverDelete(false);
    translateX.setValue(0);
    translateY.setValue(0);
    cardScale.setValue(1);
    deleteZoneOpacity.setValue(0);
  }, [translateX, translateY, cardScale, deleteZoneOpacity, updateScrollEnabled]);

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
          const over = fingerY > Dimensions.get('window').height - tabBarOffset - DELETE_ZONE_HEIGHT;
          if (over !== isOverDeleteRef.current) {
            isOverDeleteRef.current = over;
            setIsOverDelete(over);
          }
        },
        onPanResponderRelease: evt => {
          const fingerY = evt.nativeEvent.pageY;
          const over = fingerY > Dimensions.get('window').height - tabBarOffset - DELETE_ZONE_HEIGHT;

          if (over && draggingItemRef.current) {
            const item = { ...draggingItemRef.current };
            resetDragRef.current();
            Alert.alert(
              'Удалить тему',
              `Удалить тему «${item.title}»?\nВсе карточки будут удалены.`,
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Удалить',
                  style: 'destructive',
                  onPress: async () => {
                    await deleteThemeRef.current(item.id);
                    await fetchRef.current();
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

  const handleLongPress = useCallback(
    (item: Theme) => {
      isDraggingRef.current = true;
      panGrantedRef.current = false;
      draggingItemRef.current = { id: item.id, title: item.title };
      setDraggingId(item.id);
      updateScrollEnabled(false);
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
    [translateX, translateY, deleteZoneOpacity, cardScale, updateScrollEnabled],
  );

  const handlePressOut = useCallback(() => {
    if (isDraggingRef.current && !panGrantedRef.current) {
      Animated.timing(deleteZoneOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => resetDrag());
    }
  }, [deleteZoneOpacity, resetDrag]);

  const renderItem = useCallback(
    ({ item }: { item: Theme }) => {
      const isDraggingThis = draggingId === item.id;

      return (
        <Animated.View
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
          <ThemeCard
            color={item.color}
            icon={item.icon}
            title={item.title}
            description={item.description}
            progress={progressMap[item.id] ?? 0}
            onPress={() => {
              if (!isDraggingRef.current) {
                (navigation as any).navigate('ThemeDetail', { id: item.id });
              }
            }}
            onLongPress={() => handleLongPress(item)}
            onPressOut={handlePressOut}
          />
        </Animated.View>
      );
    },
    [
      draggingId,
      translateX,
      translateY,
      cardScale,
      navigation,
      handleLongPress,
      handlePressOut,
    ],
  );

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            ...TextSizes.xlarge,
            fontWeight: FontWeights.bold,
            color: Colors.textPrimary,
          }}
        >
          Мои темы
        </Text>
        <TouchableScale
          activeScale={0.9}
          style={{
            backgroundColor: Colors.primary,
            padding: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={openModal}
        >
          <PlusIcon color={Colors.textSecondary} />
        </TouchableScale>
      </View>
      <Portal>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: tabBarOffset,
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
      </Portal>
      <Portal>
        <Modal ref={modalRef}>
          <CreateThemeModal closeModal={closeModal} />
        </Modal>
      </Portal>
      <View
        ref={containerRef}
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        {...panResponder.panHandlers}
      >
        {themes.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 48,
            }}
          >
            <EmptyThemesIcon
              width={180}
              height={180}
              color={Colors.textTertiary || '#94A3B8'}
            />
            <Text
              style={{
                ...TextSizes.xlarge,
                fontWeight: FontWeights.bold,
                color: Colors.textPrimary,
                textAlign: 'center',
                marginTop: 24,
              }}
            >
              Пока нет тем
            </Text>
            <Text
              style={{
                ...TextSizes.medium,
                color: Colors.textPrimary,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 22,
              }}
            >
              Создайте первую тему для изучения карточек
            </Text>
          </View>
        ) : (
          <View style={todayBoardStyles.wrapper}>
            {themes.map(item => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>
        )}
      </View>
    </>
  );
}
