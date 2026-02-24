import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Portal } from 'react-native-portalize';
import { Colors } from 'src/styles';

type ExpandableCardProps = {
  renderPreview: (params: { onPress: () => void }) => ReactNode;
  renderExpandedContent: (params: {
    cardWidth: number;
    cardHeight: number;
  }) => ReactNode;
  expandedBottomContent?: ReactNode;
  expandedContentPlacement?: 'bottom' | 'side';
  hidePreviewWhenOpen?: boolean;
  autoOpen?: boolean;
  initialExpanded?: boolean;
  isExpanded?: boolean;
  showBackdrop?: boolean;
  expandedTopInset?: number;
  expandedBottomInset?: number;
  overlayOpacity?: number;
  width?: number | `${number}%`;
  aspectRatio?: number;
  openDuration?: number;
  onOpenChange?: (isOpen: boolean) => void;
};

export default function ExpandableCard({
  renderPreview,
  renderExpandedContent,
  expandedBottomContent,
  expandedContentPlacement = 'bottom',
  hidePreviewWhenOpen = false,
  autoOpen = false,
  initialExpanded = false,
  isExpanded,
  showBackdrop = true,
  expandedTopInset = 0,
  expandedBottomInset = 0,
  overlayOpacity = 0.5,
  width = '90%',
  aspectRatio = 1.25,
  openDuration = 220,
  onOpenChange,
}: ExpandableCardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;
  const startsExpanded = initialExpanded || autoOpen || isExpanded === true;
  const [isOpen, setIsOpen] = useState(startsExpanded);
  const openProgress = useRef(new Animated.Value(startsExpanded ? 1 : 0)).current;

  const horizontalPadding = isLandscape ? 12 : 16;
  const verticalPadding = isLandscape ? 40 : 96;

  const maxWidthByScreen = Math.max(240, screenWidth - horizontalPadding * 2);
  const availableHeight = Math.max(
    220,
    screenHeight - verticalPadding - expandedTopInset - expandedBottomInset,
  );
  const maxHeightByScreen = availableHeight;
  const maxWidthByHeight = maxHeightByScreen * aspectRatio;
  const shouldPlaceSupplementOnSide =
    expandedContentPlacement === 'side' && !!expandedBottomContent;
  const sideContentGap = 12;
  const sideContentWidth = Math.min(240, Math.max(164, screenWidth * 0.24));
  const maxCardWidthByLayout = shouldPlaceSupplementOnSide
    ? Math.max(220, maxWidthByScreen - sideContentWidth - sideContentGap)
    : maxWidthByScreen;

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

  const cardWidth = Math.min(requestedWidth, maxCardWidthByLayout, maxWidthByHeight);
  const cardHeight = cardWidth / aspectRatio;

  const openCard = () => {
    if (isOpen) {
      return;
    }

    setIsOpen(true);
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
      if (!finished) {
        return;
      }
      setIsOpen(false);
      onOpenChange?.(false);
    });
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

  useEffect(() => {
    if (!autoOpen || isOpen) {
      return;
    }

    openCard();
  }, [autoOpen, isOpen]);

  useEffect(() => {
    if (isExpanded === undefined) {
      return;
    }

    if (isExpanded && !isOpen) {
      openCard();
      return;
    }

    if (!isExpanded && isOpen) {
      closeCard();
    }
  }, [isExpanded, isOpen]);

  return (
    <>
      {!isOpen || !hidePreviewWhenOpen ? renderPreview({ onPress: openCard }) : null}
      {isOpen ? (
        <Portal>
          <View style={styles.absoluteFill} pointerEvents="box-none">
            {showBackdrop ? (
              <Pressable style={styles.absoluteFill} onPress={closeCard}>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.backdrop, overlayAnimatedStyle]}
                />
              </Pressable>
            ) : null}

            <View
              style={[
                styles.centered,
                {
                  paddingHorizontal: horizontalPadding,
                  top: expandedTopInset,
                  bottom: expandedBottomInset,
                },
              ]}
              pointerEvents="box-none"
            >
              <View
                style={[
                  styles.expandedContent,
                  shouldPlaceSupplementOnSide
                    ? styles.expandedContentSide
                    : styles.expandedContentBottom,
                ]}
                pointerEvents="box-none"
              >
                <Animated.View
                  style={[
                    styles.cardContainer,
                    cardAnimatedStyle,
                    { width: cardWidth, height: cardHeight },
                  ]}
                >
                  {renderExpandedContent({ cardWidth, cardHeight })}
                </Animated.View>

                {expandedBottomContent ? (
                  <Animated.View
                    style={[
                      styles.bottomContent,
                      cardAnimatedStyle,
                      shouldPlaceSupplementOnSide
                        ? { width: sideContentWidth }
                        : { width: cardWidth },
                    ]}
                  >
                    {expandedBottomContent}
                  </Animated.View>
                ) : null}
              </View>
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
  expandedContent: {
    gap: 12,
  },
  expandedContentBottom: {
    alignItems: 'center',
  },
  expandedContentSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'relative',
  },
  bottomContent: {
    alignSelf: 'center',
  },
});
