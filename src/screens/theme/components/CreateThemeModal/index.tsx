import { InputWithLabel } from 'src/components/InputWithLabel';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, FontWeights, TextSizes } from 'src/styles';
import XIcon from 'assets/XIcon';
import { ColorPalette } from './ColorPalette';
import { IconChoise } from './IconChoise';
import { useState } from 'react';
import { useCreateTheme } from '../../../../api/useCreateTheme';
import { useGetThemes } from 'src/hooks/useGetThemes';

export function CreateThemeModal({ closeModal }: { closeModal: () => void }) {
  const { createTheme } = useCreateTheme();
  const { fetch } = useGetThemes();

  const [props, setProps] = useState({
    title: '',
    description: '',
    color: Colors.primary,
    icons: 'CodeIcon.tsx',
  });
  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text style={{ ...TextSizes.xlarge, fontWeight: FontWeights.bold }}>
          Новая тема
        </Text>
      </View>
      <InputWithLabel
        label="Название"
        placeHolder="Например: Биология"
        value={props.title}
        onChangeText={text => {
          console.log(text);
          setProps({ ...props, title: text });
        }}
      />
      <InputWithLabel
        label="Описание"
        placeHolder="Краткое описание..."
        multiline
        value={props.description}
        onChangeText={text => setProps({ ...props, description: text })}
      />
      <ColorPalette
        color={props.color}
        onSelectColor={color => {
          console.log('Selected color:', color);
          setProps({ ...props, color });
        }}
      />
      <IconChoise
        icon={props.icons}
        onSelectIcon={icon => setProps({ ...props, icons: icon })}
      />
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 8,
        }}
        onPress={async () => {
          await createTheme({
            title: props.title,
            description: props.description,
            color: props.color,
            icon: props.icons,
          });
          closeModal();
          await fetch();
        }}
      >
        <Text
          style={{
            ...TextSizes.medium,
            fontWeight: FontWeights.bold,
            color: Colors.textSecondary,
          }}
        >
          Создать тему
        </Text>
      </TouchableOpacity>
    </View>
  );
}
