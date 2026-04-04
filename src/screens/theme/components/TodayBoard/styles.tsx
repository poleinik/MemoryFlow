import { StyleSheet } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  text: {
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.backgroundPrimary,
    borderWidth: 1.5,
    borderColor: '#D8ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  chatContent: {
    flex: 1,
    gap: 6,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 2,
  },
  senderName: {
    ...TextSizes.small,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  bubble: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  bubbleText: {
    ...TextSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textTertiary,
  },
});
export default styles;
