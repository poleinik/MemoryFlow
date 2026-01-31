import { View, Text, Button, Touchable } from "react-native";
import TouchableScale from "src/components/TouchableScale";
import { Colors } from "src/styles";
import styles from "./style";
import { useState } from "react";
const PaletteColors = [
    Colors.primary,
    Colors.backgroundAccent,
    Colors.backgroundAccent2,
    Colors.backgroundAccent3,
    Colors.backgroundAccent4,
    Colors.backgroundAccent5,
]
export function ColorPalette() {
    const [selectedColor, setSelectedColor] = useState<string>(PaletteColors[0]);
    return <View style={{padding: 4}}>
        <Text style={styles.text}>Цвет</Text>
        <View style={styles.paletteContainer}>
            {PaletteColors.map((color) => (
                <TouchableScale key={color} style={[{...styles.button,  backgroundColor: color}, color === selectedColor && styles.active]} onPress={() => setSelectedColor(color)}>
                </TouchableScale>
            ))}
            
        </View>
    </View>
}