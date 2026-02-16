import { useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import SparkleIcon from 'assets/SparcleIcon';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import { styles } from './styles';
import { layout } from 'src/styles';
import TouchableScale from 'src/components/TouchableScale';

export const CreateAICardModal = ({ closeModal }: { closeModal: () => void }) => {
    const [sourceText, setSourceText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const characterCountLabel = useMemo(
        () => `${sourceText.length} символов`,
        [sourceText.length],
    );

    return (
        <View style={layout.container}>
            <View style={styles.headerRow}>
                <View style={styles.iconBox}>
                    <SparkleIcon width={20} height={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.title}>Создать с ИИ</Text>
                    <Text style={styles.subtitle}>Вставьте текст для генерации</Text>
                </View>
            </View>

            <View style={styles.fieldWrap}>
                <Text
                    style={{
                        ...TextSizes.small,
                        fontWeight: FontWeights.semibold,
                        color: Colors.textForeground,
                        marginBottom: 8,
                    }}
                >
                    Текст для анализа
                </Text>
                <TextInput
                    multiline
                    maxLength={1000}
                    placeholder="Вставьте сюда текст из учебника, статьи или конспекта..."
                    placeholderTextColor={Colors.placeholder}
                    value={sourceText}
                    onChangeText={setSourceText}
                    style={[styles.input, isFocused && styles.inputFocused]}
                    textAlignVertical="top"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <Text style={styles.counter}>{characterCountLabel}</Text>
            </View>

            <TouchableScale
                style={styles.generateButton}
                activeOpacity={0.9}
                onPress={closeModal}
            >
                <SparkleIcon width={18} height={18} color={Colors.textSecondary} />
                <Text style={styles.generateButtonText}>Сгенерировать</Text>
            </TouchableScale>
        </View>
    );
};