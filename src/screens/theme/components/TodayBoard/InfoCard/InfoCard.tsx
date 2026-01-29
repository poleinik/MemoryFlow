import {Text, View} from "react-native";
import styles from "./style";

export function InfoCard({label, value, backgroundColor, color}: {label: string, value: string, backgroundColor?: string, color?: string   }) {
    return (
        <View style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
            <Text style={[styles.label, color ? { color } : null]}>{label}</Text>
            <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
        </View>
    )
}