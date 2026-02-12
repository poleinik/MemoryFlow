import { StyleSheet } from 'react-native';
import { Colors } from 'src/styles';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 16,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff33',
    opacity: 1,
    borderRadius: 12,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
export default styles;
