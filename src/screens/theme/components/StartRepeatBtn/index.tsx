import React from 'react'
import { View, Text } from 'react-native'
import PlayIcon from 'assets/PlayIcon'
import { Colors, FontWeights, TextSizes } from 'src/styles'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'
import ChevronRightIcon from 'assets/ChevronRightIcon'
import TouchableScale from 'src/components/TouchableScale'
export function StartButton(){
    return(
        <TouchableScale activeScale={0.95}>

 <LinearGradient style={styles.button} colors={['#3B82F6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
    <View style={styles.content}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 12 }}>
  <View style={styles.iconWrapper}>
            <PlayIcon color={Colors.backgroundPrimary} />
            </View>
            <View style={styles.textWrapper}>
                <Text style={{...TextSizes.large, fontWeight: FontWeights.bold, color: Colors.textSecondary}}>
                    Начать повторение
                </Text>
                <Text style={{...TextSizes.small, color: Colors.textSecondary}}>
                    {`${24} карточки ждут`}
                </Text>
            </View>
        </View>
            <ChevronRightIcon color='rgb(255 255 255 / 0.6)' />
    </View>
          
            </LinearGradient>
        </TouchableScale>
    )
}