import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Animated } from 'react-native';
import SparkleIcon from 'assets/SparcleIcon';
import { useGenerateCardQa } from 'src/api/useGenerateCardQa';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import { styles } from './styles';
import { layout } from 'src/styles';
import TouchableScale from 'src/components/TouchableScale';

const loadingSteps = [
    'Извлечение ключевых понятий...',
    'Формирование вопросов...',
    'Подбор точных ответов...',
    'Формирование карточек...',
];

export const CreateAICardModal = ({ closeModal }: { closeModal: () => void }) => {
    const [sourceText, setSourceText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);
    const { generateCardQa, isFetching, isError, isSuccess } = useGenerateCardQa();
    const pulseValue = useRef(new Animated.Value(0)).current;
    const progressValue = useRef(new Animated.Value(0)).current;

    const characterCountLabel = useMemo(
        () => `${sourceText.length} символов`,
        [sourceText.length],
    );

    const handleGenerate = async () => {
       await generateCardQa({ text: sourceText });
       
    };

    useEffect(() => {
        if (!isFetching) {
            pulseValue.stopAnimation();
            pulseValue.setValue(0);
            progressValue.stopAnimation();
            progressValue.setValue(0);
            setLoadingStepIndex(0);
            return;
        }

        const pulseAnimation = Animated.loop(
            Animated.timing(pulseValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            { resetBeforeIteration: true },
        );

         const totalProgressDuration = 10 *1000;
        const progressAnimation = Animated.timing(progressValue, {
            toValue: 1,
            duration: totalProgressDuration,
            useNativeDriver: false,
        });

    
        const stepDuration = totalProgressDuration / loadingSteps.length;
        const stepInterval = setInterval(() => {
            setLoadingStepIndex(prev => {
                if (prev >= loadingSteps.length - 1) {
                    clearInterval(stepInterval);
                    return prev;
                }

                return prev + 1;
            });
        }, stepDuration);

        pulseAnimation.start();
        progressAnimation.start();

        return () => {
            pulseAnimation.stop();
            progressAnimation.stop();
            clearInterval(stepInterval);
        };
    }, [isFetching, progressValue, pulseValue]);

    const pulseScale = pulseValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.65],
    });

    const pulseOpacity = pulseValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 0],
    });

    const progressWidth = progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (isFetching) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingIconWrap}>
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.loadingPulse,
                            {
                                opacity: pulseOpacity,
                                transform: [{ scale: pulseScale }],
                            },
                        ]}
                    />
                    <View style={styles.loadingIconCircle}>
                        <SparkleIcon width={40} height={40} color={Colors.textSecondary} />
                    </View>
                </View>

                <Text style={styles.loadingTitle}>ИИ анализирует текст...</Text>
                <Text style={styles.loadingSubtitle}>
                    Создаём карточки на основе вашего материала
                </Text>

                <View style={styles.loadingProgressTrack}>
                    <Animated.View
                        style={[styles.loadingProgressFill, { width: progressWidth }]}
                    />
                </View>

                <Text style={styles.loadingStepText}>{loadingSteps[loadingStepIndex]}</Text>
            </View>
        );
    }

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
                onPress={handleGenerate}
                disabled={isFetching || !sourceText.trim()}
            >
                <SparkleIcon width={18} height={18} color={Colors.textSecondary} />
                <Text style={styles.generateButtonText}>
                    {isFetching ? 'Генерирую...' : 'Сгенерировать'}
                </Text>
            </TouchableScale>

            {isError ? (
                <Text style={{ ...TextSizes.small, color: Colors.backgroundAccent2 }}>
                    Не удалось сгенерировать карточки
                </Text>
            ) : null}

            {isSuccess ? (
                <Text style={{ ...TextSizes.small, color: Colors.backgroundAccent }}>
                    Карточки успешно сгенерированы
                </Text>
            ) : null}
        </View>
    );
};