import { useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, FontWeights, layout, TextSizes } from 'src/styles';
import ArrowBackIcon from 'assets/ArrowBackIcon';
import { useGetTheme } from '../../hooks/useGetTheme';
import { useEffect } from 'react';
import { Progress } from './components/Progress';
import { AICreateBtn } from './components/AICreation';
import { Portal } from 'react-native-portalize';
import { Modal, ModalHandle } from 'src/components/Modal';
import TouchableScale from 'src/components/TouchableScale';
import { CreateCardModal } from './CreateCardModal';
import PlayIcon from 'assets/PlayIcon';
import PlusIcon from 'assets/PlusIcon';
import { CardComponent } from './components/CardComponent';
import ExpandableFlipCard from 'src/components/ExpandableFlipCard';
export type ThemeStackParamList = {
  ThemeMain: undefined;
  ThemeDetail: { id: string };
};

type Props = NativeStackScreenProps<ThemeStackParamList, 'ThemeDetail'>;

export const ThemeDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { theme, cards, fetch } = useGetTheme();
  const modalRef = useRef<ModalHandle>(null);
  const openModal = () => modalRef?.current?.openModal();
  const closeModal = () => modalRef?.current?.closeModal();

  useEffect(() => {
    fetch(id);
  }, [id]);
  useEffect(() => {
    console.log('Текущая тема в ThemeDetailScreen', theme, cards);
  }, [theme, cards]);


  return (
    <View style={layout.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
        >
          <ArrowBackIcon color={Colors.textForeground} />
        </TouchableOpacity>
        <Text>Назад</Text>
      </View>
      <View>
        <Text style={layout.header1}>{theme?.title}</Text>
        <Text style={{ ...TextSizes.small, color: Colors.textForeground }}>
          {theme?.description}
        </Text>
      </View>
      <Progress />
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <TouchableScale
          style={{
            ...layout.block,
            flexDirection: 'row',
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
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

      <View style={{ flex: 1 }}>
        <Text style={layout.header3}>Карточки</Text>
        <FlatList
          data={cards ?? []}
          style={{ flex: 1 }}
          contentContainerStyle={{  display: 'flex',
    flexDirection: 'column',
    gap: 12,}}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ExpandableFlipCard
              renderPreview={({ onPress }) => (
                <CardComponent
                  id={String(item.id)}
                  question={item.question}
                  answer={item.answer}
                  status={item.status}
                  onPress={onPress}
                />
              )}
              frontContent={
                <CardComponent
                  id={String(item.id)}
                  question={item.question}
                  answer={item.answer}
                  status={item.status}
                  mode="expanded"
                  showAnswer={false}
                />
              }
              backContent={
                <CardComponent
                  id={String(item.id)}
                  question={item.question}
                  answer={item.answer}
                  status={item.status}
                  mode="expanded"
                  showAnswer={true}
                />
              }
            />
          )}
          ListEmptyComponent={
            <Text style={{ ...TextSizes.small, color: Colors.textForeground }}>
              Пока нет карточек
            </Text>
          }
        />
      </View>

      {/* Плавающая кнопка для генерации карточек с ИИ */}
     <AICreateBtn />
      <Portal>
        <Modal ref={modalRef}>
          <CreateCardModal closeModal={closeModal} />
        </Modal>
      
      </Portal>
    </View>
  );
};
