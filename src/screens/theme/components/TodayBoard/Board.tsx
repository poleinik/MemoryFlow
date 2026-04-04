import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import RobotIcon from 'assets/RobotIcon';
import { useGenerateTodayGreeting } from 'src/api/useGenerateTodayGreeting';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import { getTodayGreetingFallback } from 'src/utils/todayGreeting';
import styles from './styles';

type TodayBoardProps = {
  pendingReviewCount: number;
  userName: string | null;
  isLoading?: boolean;
};

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((dots.length - i - 1) * 200),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.typingDots}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            {
              transform: [{
                translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
              }],
            },
          ]}
        />
      ))}
    </View>
  );
}

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
  const isTyping = isLoading || isFetching;

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
      <View style={styles.chatRow}>
        <View style={styles.avatarWrapper}>
          <RobotIcon width={32} height={32} />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.senderRow}>
            <Text style={styles.senderName}>MemoryFlow Assistant</Text>
          </View>
          <View style={styles.bubble}>
            {isTyping ? <TypingDots /> : <Text style={styles.bubbleText}>{message}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}
