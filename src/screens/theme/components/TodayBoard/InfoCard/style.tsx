import { StyleSheet } from 'react-native';
import { FontWeights, TextSizes } from 'src/styles';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    gap: 4,
    maxWidth: '30%',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    ...TextSizes.xsmall,
    fontWeight: FontWeights.medium,
  },
  value: {
    ...TextSizes.xxlarge,
    fontWeight: FontWeights.bold,
  },
});
export default styles;
