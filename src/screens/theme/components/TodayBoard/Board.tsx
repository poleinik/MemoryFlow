import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import RobotIcon from 'assets/RobotIcon';
import { useGenerateTodayGreeting } from 'src/api/useGenerateTodayGreeting';
import { Colors } from 'src/styles';
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
      <Text style={styles.sectionLabel}>Сегодня</Text>
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <View style={styles.avatarRing}>
            <RobotIcon width={32} height={32} />
          </View>
          <View style={styles.bubbleContent}>
            <View style={styles.bubbleHeader}>
              <Text style={styles.bubbleTitle}>MemoryFlow Assistant</Text>
              {(isLoading || isFetching) ? <ActivityIndicator color={Colors.primary} size="small" /> : null}
            </View>
            <Text style={styles.bubbleMessage}>{message}</Text>
          </View>
        </View>
        <View style={styles.bubbleTailOuter} />
        <View style={styles.bubbleTail} />
      </View>
    </View>
  );
}
