import { text } from '@nozbe/watermelondb/decorators';
import { StyleSheet } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  text: {
    // flexGrow: 1,
  },
  iconWrapper: {
    backgroundColor: Colors.backgroundPrimary,
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: FontWeights.bold,
    ...TextSizes.medium,
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  description: {
    fontWeight: FontWeights.regular,
    ...TextSizes.small,
    color: Colors.textForeground,
    marginBottom: 8,
  },
});
export default styles;
