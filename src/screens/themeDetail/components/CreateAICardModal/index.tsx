import SparcleIcon from "assets/SparcleIcon"
import { View, Text, TextInput } from "react-native"
import {layout} from "src/styles"
export const CreateAICardModal = ({ closeModal }: { closeModal: () => void }) => {

    return (<View style={layout.container}>
        <View>
            <SparcleIcon />
        </View>
<Text>Создать с ИИ</Text>
<Text>Вставьте текст для генерации</Text>
<TextInput multiline maxLength={1000} placeholder="Вставьте сюда текст из учебника, статьи или конспекта..." />
    </View>)
}