import { Text, View } from 'react-native';
import { Bar } from 'react-native-progress';
import { PaletteColors } from 'src/constants/PaletteColors';
import { useThemeStore } from 'src/store/useThemeStore';
import { FontWeights, layout, TextSizes } from 'src/styles';
import { styles } from './style';
export const Progress = () => {
  const { theme } = useThemeStore();
  const total = 10;
  const completed = 5;
  return (
    <View
      style={{
        ...layout.block,
        backgroundColor:
          PaletteColors.find(c => c.accent === theme?.color)?.light || 'blue',
        gap: 8,
      }}
    >
      <View style={styles.textContainer}>
        <Text style={{ ...TextSizes.small, fontWeight: FontWeights.medium }}>
          Прогресс
        </Text>
        <Text
          style={{
            fontWeight: FontWeights.bold,
            ...TextSizes.medium,
            color: theme?.color || 'blue',
          }}
        >
          {completed} / {total}
        </Text>
      </View>
      <Bar progress={0.5} width={null} color={theme?.color || 'blue'} />
    </View>
  );
};
