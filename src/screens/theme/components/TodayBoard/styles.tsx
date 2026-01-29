import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    container: {
        display: 'flex', 
        gap: 12, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    },
    text: {
        opacity: 0.6,
        textTransform: 'uppercase'
    }
})
export default styles