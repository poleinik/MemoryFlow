import { View, Text, FlatList } from 'react-native';
import EmptyThemesIcon from 'assets/EmptyThemesIcon';
import { Colors, TextSizes, FontWeights } from 'src/styles';
import PlusIcon from 'assets/PlusIcon';
import TouchableScale from 'src/components/TouchableScale';
import { Portal } from 'react-native-portalize';
import { useEffect, useRef } from 'react';
import { Modal, ModalHandle } from 'src/components/Modal';
import { CreateThemeModal } from '../CreateThemeModal';
import { ThemeCard } from '../ThemeCard';
import { useGetThemes } from 'src/hooks/useGetThemes';
import { useNavigation } from '@react-navigation/native';
import styles from '../TodayBoard/styles';

export function ThemeBoard() {
  const navigation = useNavigation();
  const { themes, fetch } = useGetThemes();
  useEffect(() => {
    fetch();
  }, []);
  const modalRef = useRef<ModalHandle>(null);
  const openModal = () => modalRef?.current?.openModal();
  const closeModal = () => modalRef?.current?.closeModal();
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
        <Modal ref={modalRef}>
          <CreateThemeModal closeModal={closeModal} />
        </Modal>
      </Portal>
      <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {themes.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
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
          <FlatList
            data={themes}
            style={{ flex: 1 }}
            contentContainerStyle={styles.wrapper}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ThemeCard
                color={item.color}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onPress={() =>
                  navigation.navigate('ThemeDetail', { id: item.id })
                }
              />
            )}
          />
        )}
      </View>
    </>
  );
}
