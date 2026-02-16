import { View, Text } from 'react-native';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { useTabSwipe } from 'src/hooks/useTabSwipe';

export function ProfileScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Profile');

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile</Text>
      </View>
    </SwipeNavigationView>
  );
}
