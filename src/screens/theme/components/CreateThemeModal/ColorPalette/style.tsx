import { StyleSheet } from 'react-native'
import { Text } from 'react-native-svg'
import { Colors, FontWeights, TextSizes } from 'src/styles'
const styles = StyleSheet.create({
   
    text: {
        ...TextSizes.small,
        fontWeight: FontWeights.semibold,
        color: Colors.textForeground,
        marginBottom: 8,
    },
    button: {

        width: 40, height: 40, borderRadius: 12
        
    },
    active:{
        boxShadow: `0 4px 10px rgba(59,130,246,0.12), inset 0 0 0 4px rgba(255,255,255,0.7)`,
    },
    paletteContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'flex-start',
    },

   
})
export default styles