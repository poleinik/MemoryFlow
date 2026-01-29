import { View, Text} from "react-native"
import { InfoCard  } from "./InfoCard/InfoCard"
import { Colors, FontWeights, TextSizes } from "src/styles"
import styles from './styles'
export function TodayBoard(){
    return(
        <View style={styles.wrapper} >
            <Text style={{...styles.text, color: Colors.textPrimary, fontWeight: FontWeights.bold, ...TextSizes.small}}>Сегодня</Text>
                <View>
                    <View style={styles.container}>
                        <InfoCard label="На повтор" value="24" backgroundColor={Colors.primary} color={Colors.textSecondary} />
                        <InfoCard label="Изучено" value="24" backgroundColor={Colors.backgroundAccent} color={Colors.textSecondary} />
                        <InfoCard label="Серия" value="24" backgroundColor={Colors.backgroundAccent2} color={Colors.textSecondary} />
                    </View>
                </View>
        </View>
      
    )
}