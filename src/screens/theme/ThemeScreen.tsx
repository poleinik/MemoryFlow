import { Button, View, Text } from 'react-native';
import { Colors } from '../../styles';
import { TodayBoard } from './components/TodayBoard/Board';
import { StartButton } from './components/StartRepeatBtn';
import { ThemeBoard } from './components/ThemeBoard';
import { useRef } from 'react';
import BottomSheet, { BottomSheetRef } from 'src/components/BottomSheet';

export function ThemeScreen() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 16,
        backgroundColor: Colors.backgroundPrimary,
        gap: 24,
      }}
    >
      <TodayBoard />
      <StartButton />
      <View style={{ flex: 1 }}>
        <ThemeBoard />
      </View>
    </View>
  );
}
