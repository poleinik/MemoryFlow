import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type FlipCardProps = {
  frontContent: ReactNode;
  backContent: ReactNode;
  isFlipped?: boolean;
  initialFlipped?: boolean;
  flipDuration?: number;
  disabled?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export default function FlipCard({
  frontContent,
  backContent,
  isFlipped,
  initialFlipped = false,
  flipDuration = 360,
  disabled = false,
  onFlipChange,
  style,
}: FlipCardProps) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(
    isFlipped ?? initialFlipped,
  );
  const displayedIsFlipped = isFlipped ?? internalIsFlipped;
  const flipProgress = useRef(
    new Animated.Value((isFlipped ?? initialFlipped) ? 1 : 0),
  ).current;

  const frontFaceStyle = useMemo(
    () => ({
      transform: [
        { perspective: 1200 },
        {
          rotateY: flipProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    }),
    [flipProgress],
  );

  const backFaceStyle = useMemo(
    () => ({
      transform: [
        { perspective: 1200 },
        {
          rotateY: flipProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
    }),
    [flipProgress],
  );

  const animateTo = (nextValue: boolean) => {
    Animated.timing(flipProgress, {
      toValue: nextValue ? 1 : 0,
      duration: flipDuration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const toggleFlip = () => {
    if (disabled) {
      return;
    }

    const nextValue = !displayedIsFlipped;
    if (isFlipped === undefined) {
      setInternalIsFlipped(nextValue);
    }
    onFlipChange?.(nextValue);
    animateTo(nextValue);
  };

  useEffect(() => {
    if (isFlipped === undefined) {
      return;
    }

    setInternalIsFlipped(isFlipped);
    animateTo(isFlipped);
  }, [isFlipped, flipDuration]);

  return (
    <TouchableOpacity activeOpacity={1} onPress={toggleFlip} disabled={disabled}>
      <Animated.View style={[styles.cardContainer, style]}>
        <Animated.View style={[styles.face, frontFaceStyle]}>{frontContent}</Animated.View>
        <Animated.View style={[styles.face, styles.backFace, backFaceStyle]}>
          {backContent}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  backFace: {
    zIndex: 2,
  },
});
