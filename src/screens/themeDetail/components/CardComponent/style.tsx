import { StyleSheet } from "react-native";
import { Colors, FontWeights, TextSizes } from "src/styles";

export const styles = StyleSheet.create({
     container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
      iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          flexShrink: 1,
          minWidth: 0,
        },
 
        title: {
          fontWeight: FontWeights.bold,
          ...TextSizes.medium,
          marginBottom: 4,
          color: Colors.textPrimary,
        },
        description: {
          fontWeight: FontWeights.regular,
          ...TextSizes.small,
          color: Colors.textForeground,

        },
    })