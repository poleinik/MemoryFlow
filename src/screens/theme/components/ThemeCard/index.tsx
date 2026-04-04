import { View, Text, PressableProps } from 'react-native';
import { IconVariants } from 'src/constants/icons/IconVariants';
import { Bar } from 'react-native-progress';

import { PaletteColors } from 'src/constants/PaletteColors';
import styles from './style';
import { Colors } from 'src/styles';
import TouchableScale from 'src/components/TouchableScale';
type TouchableThemeCardProps = PressableProps & {
  color: string;
  icon: string;
  title: string;
  description: string | null;
  progress?: number;
};
export const ThemeCard = ({
  color,
  icon,
  title,
  description,
  progress = 0,
  ...rest
}: TouchableThemeCardProps) => {
  const backgroundColor =
    PaletteColors.find(c => c.accent === color)?.light ||
    Colors.backgroundPrimary;
  return (
    <TouchableScale
      activeScale={0.9}
      style={{ backgroundColor: backgroundColor, ...styles.container }}
      {...rest}
    >
      <View style={styles.iconWrapper}>
        {IconVariants.find(iconVariant => iconVariant.name === icon)?.component(
          color,
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} ellipsizeMode="tail" numberOfLines={1}>
          {description || ''}
        </Text>
        <Bar progress={progress} width={null} color={color} />
      </View>
    </TouchableScale>
  );
};
