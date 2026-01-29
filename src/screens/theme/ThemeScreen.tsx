import { View } from "react-native";
import { Colors } from "../../styles";
import { TodayBoard } from "./components/TodayBoard/Board";
import { StartButton } from "./components/StartRepeatBtn";

export function ThemeScreen() {
    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start',  padding: 16, backgroundColor: Colors.backgroundPrimary, gap: 24}}>
          <TodayBoard />
          <StartButton />
        </View>
    
    )
}