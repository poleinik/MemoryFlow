import { StyleSheet } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';

const BUBBLE_BG = '#F6FBFF';
const BUBBLE_BORDER = '#D8ECFF';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionLabel: {
    ...TextSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  bubbleContainer: {
    marginBottom: 6,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
    borderRadius: 20,
    backgroundColor: BUBBLE_BG,
    borderWidth: 1,
    borderColor: BUBBLE_BORDER,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundPrimary,
  },
  bubbleContent: {
    flex: 1,
    gap: 6,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bubbleTitle: {
    ...TextSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    opacity: 0.8,
  },
  bubbleMessage: {
    ...TextSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bubbleTailOuter: {
    position: 'absolute',
    bottom: -10,
    left: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BUBBLE_BORDER,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: 29,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BUBBLE_BG,
  },
});
export default styles;
