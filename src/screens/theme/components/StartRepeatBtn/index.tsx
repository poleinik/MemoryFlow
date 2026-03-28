import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PlayIcon from 'assets/PlayIcon';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import ChevronRightIcon from 'assets/ChevronRightIcon';
import TouchableScale from 'src/components/TouchableScale';
import { pluralizeReviewCards } from 'src/utils/todayGreeting';

type StartButtonProps = {
  pendingReviewCount: number;
  isLoading?: boolean;
};

export function StartButton({ pendingReviewCount, isLoading = false }: StartButtonProps) {
  const navigation = useNavigation();
  const subtitle = isLoading
    ? 'Собираю план на сегодня'
    : pendingReviewCount > 0
      ? `${pendingReviewCount} ${pluralizeReviewCards(pendingReviewCount)} ждут`
      : 'Все карточки на сегодня закрыты';

  const handlePress = () => {
    const parentNavigation = navigation.getParent();

    if (!parentNavigation) {
      return;
    }

    (parentNavigation as any).navigate('Repeat', {
      reviewRequestId: Date.now(),
    });
  };

  return (
    <TouchableScale activeScale={0.95} onPress={handlePress}>
      <LinearGradient
        style={styles.button}
        colors={['#3B82F6', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
            <View style={styles.iconWrapper}>
              <PlayIcon color={Colors.backgroundPrimary} />
            </View>
            <View style={styles.textWrapper}>
              <Text
                style={{
                  ...TextSizes.large,
                  fontWeight: FontWeights.bold,
                  color: Colors.textSecondary,
                }}
              >
                Начать повторение
              </Text>
              <Text style={{ ...TextSizes.small, color: Colors.textSecondary }}>
                {subtitle}
              </Text>
            </View>
          </View>
          <ChevronRightIcon color="rgb(255 255 255 / 0.6)" />
        </View>
      </LinearGradient>
    </TouchableScale>
  );
}
