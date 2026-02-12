import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useCreateCard } from 'src/api/useCreateCard';
import { InputWithLabel } from 'src/components/InputWithLabel';
import TouchableScale from 'src/components/TouchableScale';
import { useGetTheme } from 'src/hooks/useGetTheme';
import { FontWeights, layout, TextSizes } from 'src/styles';
import { Colors } from 'src/styles';


export const CreateCardModal = ({ closeModal }: { closeModal: () => void }) => {
  const [cardProps, setCardProps] = useState({ question: '', answer: '' });
  const { createCard } = useCreateCard();
  const { theme, fetch } = useGetTheme();

  const handleAddCard = async () => {
    console.log('Добавление карточки с данными:', theme, cardProps);
    if (!theme) return;

    await createCard({
      ...cardProps,
      themeId: theme.id,
    });

    await fetch(theme.id);
    closeModal();
  };

  return (
    <View style={layout.container}>
      <Text style={layout.header3}>Новая карточка</Text>
      <InputWithLabel
        label="Вопрос"
        placeHolder="Введите вопрос или термин..."
        multiline
    
        value={cardProps.question}
        onChangeText={text =>
          setCardProps(prev => ({ ...prev, question: text }))
        }
      />
      <InputWithLabel
        label="Ответ"
        placeHolder="Введите ответ или определение..."
        multiline
        numberOfLines={4}
        value={cardProps.answer}
        onChangeText={text => setCardProps(prev => ({ ...prev, answer: text }))}
      />
      <TouchableScale
        style={{
          ...layout.block,
          backgroundColor: Colors.primary,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleAddCard}
      >
        <Text
          style={{
            color: Colors.textSecondary,
            fontWeight: FontWeights.semibold,
            ...TextSizes.medium,
          }}
        >
          Добавить карточку
        </Text>
      </TouchableScale>
    </View>
  );
};