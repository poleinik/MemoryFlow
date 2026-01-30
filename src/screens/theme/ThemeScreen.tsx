import { Button, View, Text } from "react-native";
import { Colors } from "../../styles";
import { TodayBoard } from "./components/TodayBoard/Board";
import { StartButton } from "./components/StartRepeatBtn";
import { ThemeBoard } from "./components/ThemeBoard";
import { useRef } from "react";
import BottomSheet, { BottomSheetRef } from "src/components/BottomSheet";
import { Modalize } from "react-native-modalize";

export function ThemeScreen() {
const modalRef = useRef<Modalize>(null);
  const openModal = () => modalRef?.current?.open();
    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start',  padding: 16, backgroundColor: Colors.backgroundPrimary, gap: 24}}>
          <TodayBoard />
          <StartButton />
          <ThemeBoard />
             <Modalize ref={modalRef}>
          <View style={{padding: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', lineHeight: 34}}>
              {'This is a modal'}
            </Text>
            <Text>
              {
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et euismod nisl. Nulla facilisi. Aenean et mi volutpat, iaculis libero non, luctus quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur euismod dapibus metus, eget egestas quam ullamcorper eu.'
              }
            </Text>
          </View>
        </Modalize>
        </View>
        
    
    )
}