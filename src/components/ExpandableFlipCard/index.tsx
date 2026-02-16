import { ReactNode, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Portal } from 'react-native-portalize';
import { Colors } from 'src/styles';

type ExpandableFlipCardProps = {
  renderPreview: (params: { onPress: () => void }) => ReactNode;
  frontContent: ReactNode;
  backContent: ReactNode;
  overlayOpacity?: number;
  width?: number | `${number}%`;
  aspectRatio?: number;
  openDuration?: number;
  flipDuration?: number;
  onOpenChange?: (isOpen: boolean) => void;
};

export default function ExpandableFlipCard({
  renderPreview,
  frontContent,
  backContent,
  overlayOpacity = 0.5,
  width = '90%',
  aspectRatio = 1.25,
  openDuration = 220,
  flipDuration = 360,
  onOpenChange,
}: ExpandableFlipCardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const openProgress = useRef(new Animated.Value(0)).current;
  const flipProgress = useRef(new Animated.Value(0)).current;

  const horizontalPadding = isLandscape ? 12 : 16;
  const verticalPadding = isLandscape ? 40 : 96;

  const maxWidthByScreen = Math.max(240, screenWidth - horizontalPadding * 2);
  const maxHeightByScreen = Math.max(220, screenHeight - verticalPadding);
  const maxWidthByHeight = maxHeightByScreen * aspectRatio;

  const requestedWidth =
    typeof width === 'number'
      ? width
      : (() => {
          const parsedPercent = parseFloat(width || '90');
          const adaptivePercent = isLandscape
            ? Math.min(98, parsedPercent + 6)
            : parsedPercent;
          return (screenWidth * adaptivePercent) / 100;
        })();

  const cardWidth = Math.min(requestedWidth, maxWidthByScreen, maxWidthByHeight);
  const cardHeight = cardWidth / aspectRatio;

  const openCard = () => {
    setIsOpen(true);
    setIsFlipped(false);
    flipProgress.setValue(0);
    openProgress.setValue(0);
    onOpenChange?.(true);

    Animated.timing(openProgress, {
      toValue: 1,
      duration: openDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeCard = () => {
    Animated.timing(openProgress, {
      toValue: 0,
      duration: Math.max(160, Math.floor(openDuration * 0.75)),
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setIsOpen(false);
      setIsFlipped(false);
      flipProgress.setValue(0);
      onOpenChange?.(false);
    });
  };

  const toggleFlip = () => {
    const nextValue = !isFlipped;
    setIsFlipped(nextValue);
    Animated.timing(flipProgress, {
      toValue: nextValue ? 1 : 0,
      duration: flipDuration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const overlayAnimatedStyle = {
    opacity: openProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, overlayOpacity],
    }),
  };

  const cardAnimatedStyle = {
    opacity: openProgress,
    transform: [
      {
        scale: openProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.86, 1],
        }),
      },
      {
        translateY: openProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
  };

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

  return (
    <>
      {renderPreview({ onPress: openCard })}
      {isOpen ? (
        <Portal>
          <View style={styles.absoluteFill} pointerEvents="box-none">
            <Pressable style={styles.absoluteFill} onPress={closeCard}>
              <Animated.View
                pointerEvents="none"
                style={[styles.backdrop, overlayAnimatedStyle]}
              />
            </Pressable>

            <View
              style={[styles.centered, { paddingHorizontal: horizontalPadding }]}
              pointerEvents="box-none"
            >
              <TouchableOpacity activeOpacity={1} onPress={toggleFlip}>
                <Animated.View
                  style={[
                    styles.cardContainer,
                    cardAnimatedStyle,
                    { width: cardWidth, height: cardHeight },
                  ]}
                >
                  <Animated.View style={[styles.face, frontFaceStyle]}>
                    {frontContent}
                  </Animated.View>

                  <Animated.View style={[styles.face, styles.backFace, backFaceStyle]}>
                    {backContent}
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </Portal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.textPrimary,
  },
  centered: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
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
