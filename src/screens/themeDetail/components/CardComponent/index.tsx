import SparcleIcon from "assets/SparcleIcon"
import { View, Text } from "react-native"
import TouchableScale from "src/components/TouchableScale"
import { StatusCard } from "src/model/consts"
import { Colors, layout } from "src/styles"
import { styles } from "./style"
const IconByType = {
    [StatusCard.NEW]: <SparcleIcon color="white" />,
    [StatusCard.LEARNING]: <SparcleIcon />,
    [StatusCard.MASTERED]: <SparcleIcon />,
  
}
export const CardComponent = ({id, question, answer, status}: {id: string, question: string, answer: string, status:  typeof StatusCard[keyof typeof StatusCard]}) => {
    return(
        <TouchableScale style={{...layout.block, backgroundColor: Colors.backgroundLight}}>
            <View style={styles.container}>
            <View style={{backgroundColor: Colors.primary, ...styles.iconWrapper}}>{IconByType[status]}</View>
            <View style={styles.content}>
                <Text style={styles.title}>!{question}!</Text>
                <Text style={styles.description}>{'Новая карточка'}</Text>
            </View>
            </View>
        </TouchableScale>
    )
}