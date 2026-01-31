import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import styles from "./styles";
import { Colors } from "src/styles";

export function InputWithLabel({label, placeHolder, multiline = false}: {label: string, placeHolder: string, multiline?: boolean}) {
    const [isFocused, setIsFocused] = useState(false);

    return <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View>
    <TextInput
            placeholderTextColor={Colors.placeholder}
            placeholder={placeHolder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.input, isFocused && styles.inputFocused, multiline && {height: 70}]}
            multiline={multiline}
        />
        </View>
    
    </View>
}