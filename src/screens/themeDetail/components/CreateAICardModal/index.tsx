import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Animated, ScrollView } from 'react-native';
import SparkleIcon from 'assets/SparcleIcon';
import { useGenerateCardQa } from 'src/api/useGenerateCardQa';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import { styles } from './styles';
import { layout } from 'src/styles';
import TouchableScale from 'src/components/TouchableScale';
import { useCreateCard } from 'src/api/useCreateCard';
import { useGetTheme } from 'src/hooks/useGetTheme';

const loadingSteps = [
    'Извлечение ключевых понятий...',
    'Формирование вопросов...',
    'Подбор точных ответов...',
    'Формирование карточек...',
];

type GeneratedCard = {
    question: string;
    answer: string;
};

const normalizeGeneratedCards = (value: unknown): GeneratedCard[] => {
    const toCards = (input: unknown): GeneratedCard[] => {
        if (!Array.isArray(input)) {
            return [];
        }

        return input
            .map(item => {
                if (!item || typeof item !== 'object') {
                    return null;
                }

                const question = String((item as Record<string, unknown>).question ?? '').trim();
                const answer = String((item as Record<string, unknown>).answer ?? '').trim();

                if (!question || !answer) {
                    return null;
                }

                return { question, answer };
            })
            .filter((card): card is GeneratedCard => Boolean(card));
    };

    const directCards = toCards(value);
    if (directCards.length) {
        return directCards;
    }

    if (typeof value !== 'string') {
        return [];
    }

    try {
        return toCards(JSON.parse(value));
    } catch {
        const jsonArrayMatch = value.match(/\[[\s\S]*\]/);
        if (!jsonArrayMatch) {
            return [];
        }

        try {
            return toCards(JSON.parse(jsonArrayMatch[0]));
        } catch {
            return [];
        }
    }
};

export const CreateAICardModal = ({ closeModal }: { closeModal: () => void }) => {
    const [sourceText, setSourceText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);
    const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
    const [isAddingAll, setIsAddingAll] = useState(false);
    const { generateCardQa, isFetching, isError, isSuccess, data } = useGenerateCardQa();
    const { createCard } = useCreateCard();
    const { theme, fetch } = useGetTheme();
    const pulseValue = useRef(new Animated.Value(0)).current;
    const progressValue = useRef(new Animated.Value(0)).current;

    const characterCountLabel = useMemo(
        () => `${sourceText.length} символов`,
        [sourceText.length],
    );

    const handleGenerate = async () => {
        setGeneratedCards([]);
        await generateCardQa({ text: sourceText });
    };

    const handleBackToInput = () => {
        setGeneratedCards([]);
    };

    const handleAddAllCards = async () => {
        if (!theme || !generatedCards.length || isAddingAll) {
            return;
        }

        setIsAddingAll(true);

        try {
            await Promise.all(
                generatedCards.map(card =>
                    createCard({
                        question: card.question,
                        answer: card.answer,
                        themeId: theme.id,
                    }),
                ),
            );

            await fetch(theme.id);
            closeModal();
        } finally {
            setIsAddingAll(false);
        }
    };

    useEffect(() => {
        if (!isSuccess) {
            return;
        }

        const cards = normalizeGeneratedCards(data);
        setGeneratedCards(cards);
    }, [data, isSuccess]);

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
            <View style={styles.modalContentWrap}>
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
            </View>
        );
    }

    if (generatedCards.length > 0) {
        return (
            <View style={styles.modalContentWrap}>
                <View style={styles.generatedContainer}>
                    <View style={styles.generatedHeaderRow}>
                        <Text style={styles.generatedReadyText}>{`Готово: ${generatedCards.length} карточек`}</Text>

                        <TouchableScale activeOpacity={0.9} onPress={handleBackToInput}>
                            <Text style={styles.retryText}>Заново</Text>
                        </TouchableScale>
                    </View>

                    <ScrollView
                        style={styles.generatedListWrap}
                        contentContainerStyle={styles.generatedListContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {generatedCards.map((card, index) => (
                            <View key={`${card.question}-${index}`} style={styles.generatedCard}>
                                <View style={styles.generatedBadge}>
                                    <Text style={styles.generatedBadgeText}>{index + 1}</Text>
                                </View>

                                <View style={styles.generatedTextWrap}>
                                    <Text style={styles.generatedQuestion}>{card.question}</Text>
                                    <Text style={styles.generatedAnswer}>{card.answer}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.generatedButtonsRow}>
                        <TouchableScale
                            style={styles.backButton}
                            activeOpacity={0.9}
                            onPress={handleBackToInput}
                            disabled={isAddingAll}
                        >
                            <Text style={styles.backButtonText}>Назад</Text>
                        </TouchableScale>

                        <TouchableScale
                            style={styles.addAllButton}
                            activeOpacity={0.9}
                            onPress={handleAddAllCards}
                            disabled={isAddingAll}
                        >
                            <Text style={styles.addAllButtonText}>
                                {isAddingAll ? 'Добавляю...' : 'Добавить все'}
                            </Text>
                        </TouchableScale>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.modalContentWrap}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
                            Не удалось распознать карточки в ответе ИИ
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
};