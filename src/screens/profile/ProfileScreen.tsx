import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { useTabSwipe } from 'src/hooks/useTabSwipe';
import { database } from 'src/model';
import User, { type AiModelConfig } from 'src/model/User';
import { Colors, FontWeights, TextSizes, layout } from 'src/styles';
import { InputWithLabel } from 'src/components/InputWithLabel';
import { Modal, type ModalHandle } from 'src/components/Modal';
import XIcon from 'assets/XIcon';
import PlusIcon from 'assets/PlusIcon';

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const users = await database.get<User>('user').query().fetch();
      if (users.length > 0) {
        setUser(users[0]);
      } else {
        await database.write(async () => {
          const created = await database.get<User>('user').create(u => {
            u.name = '';
            u.notificationHour = 9;
            u.notificationMinute = 0;
          });
          setUser(created);
        });
      }
    };
    loadUser();
  }, []);

  const updateUser = useCallback(
    async (updater: (u: User) => void) => {
      if (!user) return;
      await database.write(async () => {
        await user.update(updater);
      });
      setUser(user);
    },
    [user],
  );

  return { user, updateUser };
};


export function ProfileScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Profile');
  const { user, updateUser } = useUser();

  const [name, setName] = useState('');
  const [aiModels, setAiModels] = useState<AiModelConfig[]>([]);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelToken, setNewModelToken] = useState('');
  const modalRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setAiModels(user.aiModels);
    setAvatarUri(user.avatarUri);
  }, [user]);

  const handlePickAvatar = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    if (result.didCancel || !result.assets?.[0]?.uri) return;
    const uri = result.assets[0].uri;
    setAvatarUri(uri);
    await updateUser(u => {
      u.avatarUri = uri;
    });
  }, [updateUser]);

  const handleSaveName = useCallback(async () => {
    await updateUser(u => {
      u.name = name.trim();
    });
  }, [name, updateUser]);

  const saveModels = useCallback(
    async (updated: AiModelConfig[]) => {
      setAiModels(updated);
      await updateUser(u => {
        u.aiConfigRaw = JSON.stringify(updated);
      });
    },
    [updateUser],
  );

  const handleAddModel = useCallback(async () => {
    const trimmedName = newModelName.trim();
    const trimmedToken = newModelToken.trim();
    if (!trimmedName) {
      Alert.alert('Ошибка', 'Укажите название модели');
      return;
    }
    await saveModels([...aiModels, { name: trimmedName, token: trimmedToken, enabled: true }]);
    setNewModelName('');
    setNewModelToken('');
    modalRef.current?.closeModal();
  }, [newModelName, newModelToken, aiModels, saveModels]);

  const handleRemoveModel = useCallback(
    async (index: number) => {
      await saveModels(aiModels.filter((_, i) => i !== index));
    },
    [aiModels, saveModels],
  );

  const handleToggleModel = useCallback(
    async (index: number) => {
      const updated = aiModels.map((m, i) =>
        i === index ? { ...m, enabled: !(m.enabled ?? true) } : m,
      );
      await saveModels(updated);
    },
    [aiModels, saveModels],
  );

  const handleMoveModel = useCallback(
    async (index: number, direction: -1 | 1) => {
      const target = index + direction;
      if (target < 0 || target >= aiModels.length) return;
      const updated = [...aiModels];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      await saveModels(updated);
    },
    [aiModels, saveModels],
  );

  const initials = name.trim()
    ? name.trim()[0].toUpperCase()
    : '?';

  if (!user) return null;

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <ScrollView
        style={layout.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Avatar & name header */}
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={handlePickAvatar}
          activeOpacity={0.7}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
          <Text style={styles.avatarHint}>Нажмите, чтобы изменить</Text>
        </TouchableOpacity>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Имя</Text>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Введите имя"
              placeholderTextColor={Colors.placeholder}
              onBlur={handleSaveName}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
          </View>
        </View>

        {/* AI Models */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ИИ модели</Text>
          <Text style={styles.sectionHint}>
            Модели для генерации карточек
          </Text>

          {aiModels.length === 0 && (
            <Text style={styles.emptyText}>Нет добавленных моделей</Text>
          )}

          {aiModels.map((model, index) => {
            const isEnabled = model.enabled ?? true;
            return (
              <View
                key={index}
                style={[
                  styles.modelCard,
                  !isEnabled && styles.modelCardDisabled,
                ]}>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => handleToggleModel(index)}>
                  <View
                    style={[
                      styles.toggleOuter,
                      isEnabled && styles.toggleOuterActive,
                    ]}>
                    {isEnabled && <View style={styles.toggleInner} />}
                  </View>
                </TouchableOpacity>
                <View style={styles.modelInfo}>
                  <Text
                    style={[
                      styles.modelName,
                      !isEnabled && styles.modelNameDisabled,
                    ]}>
                    {model.name}
                  </Text>
                  <Text style={styles.modelToken} numberOfLines={1}>
                    {model.token
                      ? '••••' + model.token.slice(-6)
                      : 'Без токена'}
                  </Text>
                </View>
                <View style={styles.reorderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.reorderButton,
                      index === 0 && styles.reorderButtonHidden,
                    ]}
                    onPress={() => handleMoveModel(index, -1)}
                    disabled={index === 0}>
                    <Text style={styles.reorderButtonText}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.reorderButton,
                      index === aiModels.length - 1 &&
                        styles.reorderButtonHidden,
                    ]}
                    onPress={() => handleMoveModel(index, 1)}
                    disabled={index === aiModels.length - 1}>
                    <Text style={styles.reorderButtonText}>▼</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveModel(index)}>
                  <XIcon
                    width={16}
                    height={16}
                    color={Colors.backgroundAccent4}
                  />
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => modalRef.current?.openModal()}>
            <PlusIcon width={18} height={18} color={Colors.primary} />
            <Text style={styles.addButtonText}>Добавить модель</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Model Modal */}
      <Modal ref={modalRef} enableKeyboardAvoiding>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Новая ИИ модель</Text>
          <InputWithLabel
            label="Название модели"
            placeHolder="например, deepseek-r1:7b"
            value={newModelName}
            onChangeText={setNewModelName}
          />
          <InputWithLabel
            label="API токен"
            placeHolder="Введите токен (необязательно)"
            value={newModelToken}
            onChangeText={setNewModelToken}
            secureTextEntry
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddModel}>
            <Text style={styles.saveButtonText}>Добавить</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SwipeNavigationView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 48,
    gap: 24,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    ...TextSizes.xxlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
  },
  avatarHint: {
    ...TextSizes.small,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  section: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    ...TextSizes.large,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  sectionHint: {
    ...TextSizes.small,
    color: Colors.textTertiary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    ...TextSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    padding: 12,
    borderRadius: 12,
  },
  modelCardDisabled: {
    opacity: 0.5,
  },
  toggleButton: {
    padding: 4,
    marginRight: 8,
  },
  toggleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleOuterActive: {
    borderColor: Colors.primary,
  },
  toggleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  modelInfo: {
    flex: 1,
    gap: 2,
  },
  modelName: {
    ...TextSizes.medium,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  modelNameDisabled: {
    color: Colors.textTertiary,
  },
  modelToken: {
    ...TextSizes.small,
    color: Colors.textTertiary,
  },
  reorderButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginRight: 4,
  },
  reorderButton: {
    padding: 2,
  },
  reorderButtonHidden: {
    opacity: 0,
  },
  reorderButtonText: {
    ...TextSizes.small,
    color: Colors.textTertiary,
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    ...TextSizes.small,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    ...TextSizes.medium,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  modalContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  modalTitle: {
    ...TextSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    ...TextSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
  },
});
