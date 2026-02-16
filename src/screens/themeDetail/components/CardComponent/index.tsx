import SparcleIcon from "assets/SparcleIcon"
import { View, Text } from "react-native"
import TouchableScale from "src/components/TouchableScale"
import { StatusCard } from "src/model/consts"
import { Colors, TextSizes, layout } from "src/styles"
import { styles } from "./style"
const IconByType = {
    [StatusCard.NEW]: <SparcleIcon color="white" />,
    [StatusCard.LEARNING]: <SparcleIcon />,
    [StatusCard.MASTERED]: <SparcleIcon />,
  
}

type CardMode = 'compact' | 'expanded';

type CardComponentProps = {
    id: string;
    question: string;
    answer: string;
    status: typeof StatusCard[keyof typeof StatusCard];
    mode?: CardMode;
    showAnswer?: boolean;
    onPress?: () => void;
};

export const CardComponent = ({
    question,
    answer,
    status,
    mode = 'compact',
    showAnswer = false,
    onPress,
}: CardComponentProps) => {
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
            style={{ ...layout.block, backgroundColor: Colors.backgroundLight }}
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={{ backgroundColor: Colors.primary, ...styles.iconWrapper }}>
                    {IconByType[status]}
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>{question}</Text>
                    <Text style={styles.description}>{'Новая карточка'}</Text>
                </View>
            </View>
        </TouchableScale>
    );
}