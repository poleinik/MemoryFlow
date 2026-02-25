import SparcleIcon from "assets/SparcleIcon"
import OpenBookIcon from "assets/OpenBookIcon"
import ClockIcon from "assets/ClockIcon"
import CheckIcon from "assets/CheckIcon"
import { View, Text } from "react-native"
import TouchableScale from "src/components/TouchableScale"
import { StatusCard } from "src/model/consts"
import { Colors, TextSizes, layout } from "src/styles"
import { styles } from "./style"
const IconByType = {
    [StatusCard.NEW]: <SparcleIcon color="white" />,
    [StatusCard.LEARNING]: <OpenBookIcon color="white" />,
    [StatusCard.MASTERED]: <SparcleIcon color="white" />,
  
}

type CardMode = 'compact' | 'expanded';

type CardComponentProps = {
    id: string;
    question: string;
    answer: string;
    status: typeof StatusCard[keyof typeof StatusCard];
    nextReviewAt?: Date | null;
    mode?: CardMode;
    showAnswer?: boolean;
    onPress?: () => void;
};

const formatDaysWord = (days: number) => {
    const mod10 = days % 10;
    const mod100 = days % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return 'день';
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return 'дня';
    }

    return 'дней';
};

const getCompactDescription = ({
    status,
    nextReviewAt,
    isReviewDue,
}: {
    status: typeof StatusCard[keyof typeof StatusCard];
    nextReviewAt?: Date | null;
    isReviewDue: boolean;
}) => {
    if (status !== StatusCard.LEARNING) {
        return 'Новая карточка';
    }

    if (isReviewDue) {
        return 'Требует повторения';
    }

    if (!nextReviewAt) {
        return 'Повтор сегодня';
    }

    const now = new Date();
    const isSameDay =
        nextReviewAt.getFullYear() === now.getFullYear() &&
        nextReviewAt.getMonth() === now.getMonth() &&
        nextReviewAt.getDate() === now.getDate();

    if (isSameDay) {
        return 'Повтор сегодня';
    }

    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfNextReviewDay = new Date(
        nextReviewAt.getFullYear(),
        nextReviewAt.getMonth(),
        nextReviewAt.getDate(),
    ).getTime();
    const diffDays = Math.round((startOfNextReviewDay - startOfToday) / dayMs);

    if (diffDays <= 0) {
        return 'Повтор сегодня';
    }

    return `Повтор через ${diffDays} ${formatDaysWord(diffDays)}`;
};

export const CardComponent = ({
    question,
    answer,
    status,
    nextReviewAt,
    mode = 'compact',
    showAnswer = false,
    onPress,
}: CardComponentProps) => {
    const isMastered = status === StatusCard.MASTERED;
    const isReviewDue =
        status === StatusCard.LEARNING &&
        !!nextReviewAt &&
        nextReviewAt.getTime() <= Date.now();

    const iconBackgroundColor =
        isReviewDue
            ? Colors.backgroundAccent2
                        : isMastered
                            ? Colors.backgroundAccent
            : status === StatusCard.LEARNING
              ? Colors.backgroundAccent5
              : Colors.primary;

    const cardBackgroundColor =
        isReviewDue
            ? Colors.backgroundLight3
                        : isMastered
                            ? Colors.backgroundLight2
            : status === StatusCard.LEARNING
              ? Colors.backgroundLight6
              : Colors.backgroundLight;

    const icon = isReviewDue
        ? <ClockIcon color="white" />
        : isMastered
            ? <CheckIcon color="white" />
            : IconByType[status];

    if (mode === 'expanded') {
        return (
            <View style={styles.expandedCard}>
                <Text style={styles.expandedLabel}>{showAnswer ? 'Ответ' : 'Вопрос'}</Text>
                <Text style={styles.expandedText}>{showAnswer ? answer : question}</Text>
                <Text style={{ ...TextSizes.small, color: Colors.textForeground }}>
                    Нажмите, чтобы перевернуть
                </Text>
            </View>
        );
    }

    return (
        <TouchableScale
            style={{ ...layout.block, backgroundColor: cardBackgroundColor }}
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={{ backgroundColor: iconBackgroundColor, ...styles.iconWrapper }}>
                    {icon}
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>{question}</Text>
                    <Text style={styles.description}>
                        {getCompactDescription({ status, nextReviewAt, isReviewDue })}
                    </Text>
                </View>
            </View>
        </TouchableScale>
    );
}