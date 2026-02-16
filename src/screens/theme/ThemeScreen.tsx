import { View } from 'react-native';
import { Colors } from '../../styles';
import { TodayBoard } from './components/TodayBoard/Board';
import { StartButton } from './components/StartRepeatBtn';
import { ThemeBoard } from './components/ThemeBoard';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { useTabSwipe } from 'src/hooks/useTabSwipe';

export function ThemeScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Theme');

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: 16,
          backgroundColor: Colors.backgroundPrimary,
          gap: 24,
        }}
      >
        <TodayBoard />
        <StartButton />
        <View style={{ flex: 1 }}>
          <ThemeBoard />
        </View>
      </View>
    </SwipeNavigationView>
  );
}
