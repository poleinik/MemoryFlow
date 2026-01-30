import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import EmptyThemesIcon from 'assets/EmptyThemesIcon';
import { Colors, TextSizes, FontWeights } from 'src/styles';
import PlusIcon from 'assets/PlusIcon';
import TouchableScale from 'src/components/TouchableScale';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useRef } from 'react';
import XIcon from 'assets/XIcon';

export function ThemeBoard() {
    const themes = []; // Пока пустой массив тем
 const modalRef = useRef<Modalize>(null);
  const openModal = () => modalRef?.current?.open();
  const closeModal = () => modalRef?.current?.close();
    return (
        <View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
            <Text style={{...TextSizes.xlarge, fontWeight: FontWeights.bold, color: Colors.textPrimary}}>
                Мои темы
            </Text>
            <TouchableScale activeScale={0.9} style={{backgroundColor: Colors.primary, padding: 8, borderRadius: 8, alignItems: 'center'}} onPress={openModal}>
                <PlusIcon color={Colors.textSecondary} />
            </TouchableScale>
        </View>
          <Portal>
            <Modalize ref={modalRef} adjustToContentHeight={true} >
              <View style={{display: 'flex', flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, marginBottom: 12}}>
                <Text style={{...TextSizes.xlarge, fontWeight: FontWeights.bold}}>
                  Новая тема
                </Text>
                <TouchableOpacity onPress={closeModal} style={{backgroundColor: Colors.backgroundPrimary, padding: 12, borderRadius: 8, alignItems: 'center'}}>
                    <XIcon color={'black'} />
                </TouchableOpacity>
              </View>
              <Text>Название</Text>
              <TextInput
                placeholder="Например: Биология"
                />
                <Text>Описание</Text>
                <TextInput
                placeholder="Краткое описание..."
                />
            </Modalize>
          </Portal>
        <View style={{display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 200}}>
            {themes.length === 0 ? (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <EmptyThemesIcon width={180} height={180} color={Colors.textTertiary || '#94A3B8'} />
                <Text style={{
                    ...TextSizes.xlarge,
                    fontWeight: FontWeights.bold,
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    marginTop: 24
                }}>
                    Пока нет тем
                </Text>
                <Text style={{
                    ...TextSizes.medium,
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    marginTop: 8,
                    lineHeight: 22
                }}>
                    Создайте первую тему для изучения карточек
                </Text>
            </View>
        )    : (
            <View>
                {/* Здесь будет отображение тем */}
            </View>
        )}
        </View>
        </View>
    )

}