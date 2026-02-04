import { View, Text } from "react-native";
import { IconVariants } from "src/constants/icons/IconVariants";
import {Bar} from 'react-native-progress';

import { PaletteColors } from "src/constants/PaletteColors";
import styles from "./style";
import { Colors } from "src/styles";
import TouchableScale from "src/components/TouchableScale";
export const ThemeCard = (props: {color: string, icon: string, title: string, description: string}) => {
    const backgroundColor = PaletteColors.find(c => c.accent === props.color)?.light || Colors.backgroundPrimary;
    return(
        <TouchableScale activeScale={0.9} style={{backgroundColor: backgroundColor, ...styles.container}}>
            <View style={styles.iconWrapper}>
            {IconVariants.find(iconVariant => iconVariant.name === props.icon)?.component(props.color) }
            </View>
            <View style={styles.content}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.description}>{props.description}</Text>
            <Bar progress={0.3} width={null} color={props.color} />
            </View>
        </TouchableScale>
    )
}