import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Colors } from '../../styles';
import { useTodayReviewSummary } from 'src/hooks/useTodayReviewSummary';
import { TodayBoard } from './components/TodayBoard/Board';
import { StartButton } from './components/StartRepeatBtn';
import { ThemeBoard } from './components/ThemeBoard';

export function ThemeScreen() {
    const { pendingReviewCount, userName, isLoading } = useTodayReviewSummary();
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    return (
        <ScrollView
          style={{ flex: 1, backgroundColor: Colors.backgroundPrimary }}
          contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 32 }}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={isScrollEnabled}
        >
          <TodayBoard
            pendingReviewCount={pendingReviewCount}
            userName={userName}
            isLoading={isLoading}
          />
          <View
            style={{
              backgroundColor: Colors.backgroundPrimary,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <StartButton pendingReviewCount={pendingReviewCount} isLoading={isLoading} />
          </View>
          <ThemeBoard onScrollEnabledChange={setIsScrollEnabled} />
        </ScrollView>
    )
}