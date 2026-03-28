import { StyleSheet } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    display: 'flex',
    padding: 16,
    gap: 12,
    borderRadius: 20,
    backgroundColor: '#F6FBFF',
    borderWidth: 1,
    borderColor: '#D8ECFF',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 16,
    elevation: 2,
  },
  text: {
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundPrimary,
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardEyebrow: {
    ...TextSizes.xsmall,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    opacity: 0.8,
  },
  cardTitle: {
    ...TextSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  cardMessage: {
    ...TextSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
});
export default styles;
