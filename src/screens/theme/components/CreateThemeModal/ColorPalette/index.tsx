import { View, Text } from "react-native";
import TouchableScale from "src/components/TouchableScale";
import styles from "./style";
import {PaletteColors} from 'src/constants/PaletteColors';

type ColorPaletteProps = {
    color: string;
    onSelectColor: (color: string) => void;
};
export function ColorPalette({ color, onSelectColor }: ColorPaletteProps) {
    return <View style={{padding: 4}}>
        <Text style={styles.text}>Цвет</Text>
        <View style={styles.paletteContainer}>
            {PaletteColors.map((c) => (
                <TouchableScale activeScale={1.2}  key={c.accent} style={[{...styles.button,  backgroundColor: c.accent}, c.accent === color && styles.active]} onPress={() => onSelectColor(c.accent)}>
                </TouchableScale>
            ))}
            
        </View>
    </View>
}