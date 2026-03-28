import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import BrainSparklesIcon from 'assets/BrainSparklesIcon';
import { useGenerateTodayGreeting } from 'src/api/useGenerateTodayGreeting';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import { getTodayGreetingFallback } from 'src/utils/todayGreeting';
import styles from './styles';

type TodayBoardProps = {
  pendingReviewCount: number;
  userName: string | null;
  isLoading?: boolean;
};

export function TodayBoard({
  pendingReviewCount,
  userName,
  isLoading = false,
}: TodayBoardProps) {
  const { data, isFetching, generateGreeting } = useGenerateTodayGreeting();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    generateGreeting({ pendingReviewCount, userName });
  }, [generateGreeting, isLoading, pendingReviewCount, userName]);

  const fallbackMessage = getTodayGreetingFallback({ pendingReviewCount, userName });
  const message = data ?? fallbackMessage;

  return (
    <View style={styles.wrapper}>
      <Text
        style={{
          ...styles.text,
          color: Colors.textPrimary,
          fontWeight: FontWeights.bold,
          ...TextSizes.small,
        }}
      >
        Сегодня
      </Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <BrainSparklesIcon width={28} height={28} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardEyebrow}>AI-ПЛАН НА СЕГОДНЯ</Text>
            <Text style={styles.cardTitle}>MemoryFlow Assistant</Text>
          </View>
          {(isLoading || isFetching) ? <ActivityIndicator color={Colors.primary} /> : null}
        </View>
        <Text style={styles.cardMessage}>{message}</Text>
      </View>
    </View>
  );
}
