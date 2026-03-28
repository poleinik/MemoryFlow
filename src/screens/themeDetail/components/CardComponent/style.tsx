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
        expandedCard: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: Colors.backgroundLight,
          borderRadius: 16,
          padding: 20,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: Colors.borderColor,
        },
        expandedLabel: {
          ...TextSizes.small,
          fontWeight: FontWeights.semibold,
          color: Colors.textForeground,
        },
        expandedText: {
          ...TextSizes.xlarge,
          fontWeight: FontWeights.bold,
          color: Colors.textPrimary,
        },
        expandedScrollWrap: {
          flex: 1,
        },
        expandedScrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
        },
        deleteButton: {
          padding: 8,
          borderRadius: 8,
        },
    })