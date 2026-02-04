import { StyleSheet } from 'react-native'
import { Colors, FontWeights, TextSizes } from 'src/styles'
const styles = StyleSheet.create({
   
    text: {
        ...TextSizes.small,
        fontWeight: FontWeights.semibold,
        color: Colors.textForeground,
        marginBottom: 8,
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundSecondary,
        width: 48, height: 48, borderRadius: 12, 
    
    },
    active:{
        backgroundColor: Colors.primary,
        boxShadow: `inset 0 0 0 4px rgba(255,255,255,0.7)`,
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'flex-start',
    },

   
})
export default styles