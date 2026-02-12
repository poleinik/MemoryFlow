import React, {useRef, useState} from 'react';
import { Animated, TouchableOpacity, PressableProps, StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';

type TouchableScaleProps = PressableProps & {
  children?: React.ReactNode;
  activeScale?: number;
  activeOpacity?: number
  style?: StyleProp<ViewStyle>;
};

export default function TouchableScale({
  children,
  activeScale = 0.95,
  activeOpacity = 0.9,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: TouchableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const handlePressIn = (e: GestureResponderEvent) => {
    setPressed(true);
    Animated.spring(scale, { toValue: activeScale, useNativeDriver: true }).start();
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setPressed(false);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    if (onPressOut) onPressOut(e);
  };

  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={rest?.onPress || undefined}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
