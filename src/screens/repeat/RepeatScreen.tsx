import { View, Text } from 'react-native';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { useTabSwipe } from 'src/hooks/useTabSwipe';

export function RepeatScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Repeat');

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Repeat</Text>
      </View>
    </SwipeNavigationView>
  );
}
