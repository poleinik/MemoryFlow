import { View, Text, TextInput, type TextInputProps } from "react-native";
import { useState } from "react";
import styles from "./styles";
import { Colors } from "src/styles";

type InputWithLabelProps = TextInputProps & {
    label: string;
    placeHolder?: string;
};

export function InputWithLabel({
    label,
    placeHolder,
    multiline = false,
    style,
    ...textInputProps
}: InputWithLabelProps) {
    const [isFocused, setIsFocused] = useState(false);

    return <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
            placeholderTextColor={Colors.placeholder}
            placeholder={placeHolder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.input, isFocused && styles.inputFocused, multiline && { height: 70 }, style]}
            multiline={multiline}
            {...textInputProps}
            />
        </View>
    
    </View>
}