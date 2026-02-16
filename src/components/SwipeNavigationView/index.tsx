import { ReactNode, useMemo, useRef } from 'react';
import {
  PanResponder,
  StyleProp,
  View,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

type SwipeNavigationViewProps = {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minDistance?: number;
  maxVerticalDistance?: number;
  style?: StyleProp<ViewStyle>;
  enabled?: boolean;
};

export default function SwipeNavigationView({
  children,
  onSwipeLeft,
  onSwipeRight,
  minDistance = 72,
  maxVerticalDistance = 40,
  style,
  enabled = true,
}: SwipeNavigationViewProps) {
  const hasHandledGesture = useRef(false);

  const handleRelease = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (!enabled) return;
    if (hasHandledGesture.current) return;

    const { dx, dy } = gestureState;
    if (Math.abs(dy) > maxVerticalDistance) return;

    if (dx <= -minDistance && onSwipeLeft) {
      hasHandledGesture.current = true;
      onSwipeLeft();
      return;
    }

    if (dx >= minDistance && onSwipeRight) {
      hasHandledGesture.current = true;
      onSwipeRight();
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (!enabled) return false;
          const { dx, dy } = gestureState;
          const isHorizontalIntent =
            Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.25;
          return isHorizontalIntent;
        },
        onPanResponderGrant: () => {
          hasHandledGesture.current = false;
        },
        onPanResponderRelease: handleRelease,
        onPanResponderTerminate: () => {
          hasHandledGesture.current = false;
        },
      }),
    [enabled, maxVerticalDistance, minDistance, onSwipeLeft, onSwipeRight],
  );

  return (
    <View style={[{ flex: 1 }, style]} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
