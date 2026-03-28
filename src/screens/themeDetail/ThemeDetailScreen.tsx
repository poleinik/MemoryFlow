import { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
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

  const handleDeleteCard = (cardId: string, question: string) => {
    Alert.alert(
      'Удалить карточку',
      `Вы уверены, что хотите удалить карточку «${question}»?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteCard(cardId);
            await fetch(id);
          },
        },
      ],
    );
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
      <View style={layout.container}>
        <ScrollView
          style={{ flex: 1, margin: -16 }}
          contentContainerStyle={{ padding: 16, gap: 24 }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[3]}
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

                return (
                  <ExpandableCard
                    key={String(item.id)}
                    renderPreview={({ onPress }) => (
                      <CardComponent
                        id={String(item.id)}
                        question={item.question}
                        answer={item.answer}
                        status={cardStatus}
                        nextReviewAt={item.nextReviewAt}
                        onPress={onPress}
                        onDelete={() => handleDeleteCard(item.id, item.question)}
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
                );
              })
            )}
          </View>
        </View>
        </ScrollView>

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
