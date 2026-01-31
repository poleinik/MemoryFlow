import { InputWithLabel } from "src/components/InputWithLabel";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors, FontWeights, TextSizes } from "src/styles";
import XIcon from "assets/XIcon";
import { ColorPalette } from "./ColorPalette";
export function CreateThemeModal({closeModal}: {closeModal: () => void}) {
    return (
        
        <View style={{display: 'flex', flexDirection: 'column', gap: 16 }}>
         <View style={{display: 'flex', flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
            <Text style={{...TextSizes.xlarge, fontWeight: FontWeights.bold}}>
                Новая тема
            </Text>
            <TouchableOpacity onPress={closeModal} style={{backgroundColor: Colors.backgroundPrimary, padding: 12, borderRadius: 8, alignItems: 'center'}}>
                <XIcon color={'black'} />
            </TouchableOpacity>
        </View>
        <InputWithLabel label="Название" placeHolder="Например: Биология" />
        <InputWithLabel label="Описание" placeHolder="Краткое описание..." multiline />
        <ColorPalette />
        <TouchableOpacity activeOpacity={0.9} style={{backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8}}>
            <Text style={{...TextSizes.medium, fontWeight: FontWeights.bold, color: Colors.textSecondary}}>
                Создать тему
            </Text>
        </TouchableOpacity>
        </View>
    )
}
