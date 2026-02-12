import { StyleSheet } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,

    gap: 8,
  },
  label: {
    ...TextSizes.small,
    color: Colors.textForeground,
    fontWeight: FontWeights.semibold,
  },
  inputWrapper: {
    padding: 4,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontWeight: FontWeights.bold,
    color: Colors.textTertiary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
});
export default styles;
