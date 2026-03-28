import { View } from 'react-native';
import { Colors } from '../../styles';
import { useTodayReviewSummary } from 'src/hooks/useTodayReviewSummary';
import { TodayBoard } from './components/TodayBoard/Board';
import { StartButton } from './components/StartRepeatBtn';
import { ThemeBoard } from './components/ThemeBoard';

export function ThemeScreen() {
    const { pendingReviewCount, userName, isLoading } = useTodayReviewSummary();
    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start',  padding: 16, backgroundColor: Colors.backgroundPrimary, gap: 24}}>
          <TodayBoard pendingReviewCount={pendingReviewCount} userName={userName} isLoading={isLoading} />
          <StartButton pendingReviewCount={pendingReviewCount} isLoading={isLoading} />
          <View style={{flex: 1}}>
            <ThemeBoard />
          </View>
        </View>
    )
}