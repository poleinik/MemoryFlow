import { Text, View } from 'react-native';
import TouchableScale from 'src/components/TouchableScale';
import { IconVariants } from 'src/constants/icons/IconVariants';
import styles from './style';

type IconChoiseProps = {
  icon: string;
  onSelectIcon: (icon: string) => void;
};
export const IconChoise = ({ icon, onSelectIcon }: IconChoiseProps) => {
  return (
    <View>
      <Text style={styles.text}>Иконка</Text>
      <View style={styles.iconContainer}>
        {IconVariants.map(iconVariant => (
          <TouchableScale
            activeScale={1.2}
            activeOpacity={1}
            key={iconVariant.name}
            style={[styles.button, icon === iconVariant.name && styles.active]}
            onPress={() => onSelectIcon(iconVariant.name)}
          >
            {iconVariant.component(
              icon === iconVariant.name ? 'white' : 'black',
            )}
          </TouchableScale>
        ))}
      </View>
    </View>
  );
};
