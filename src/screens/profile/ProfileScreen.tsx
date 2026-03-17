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

const pad = (n: number) => String(n).padStart(2, '0');

export function ProfileScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Profile');
  const { user, updateUser } = useUser();

  const [name, setName] = useState('');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [aiModels, setAiModels] = useState<AiModelConfig[]>([]);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelToken, setNewModelToken] = useState('');
  const modalRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setHour(user.notificationHour ?? 9);
    setMinute(user.notificationMinute ?? 0);
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

  const handleChangeHour = useCallback(
    async (delta: number) => {
      const next = (hour + delta + 24) % 24;
      setHour(next);
      await updateUser(u => {
        u.notificationHour = next;
      });
    },
    [hour, updateUser],
  );

  const handleChangeMinute = useCallback(
    async (delta: number) => {
      const next = (minute + delta + 60) % 60;
      setMinute(next);
      await updateUser(u => {
        u.notificationMinute = next;
      });
    },
    [minute, updateUser],
  );

  const handleAddModel = useCallback(async () => {
    const trimmedName = newModelName.trim();
    const trimmedToken = newModelToken.trim();
    if (!trimmedName) {
      Alert.alert('Ошибка', 'Укажите название модели');
      return;
    }
    const updated = [...aiModels, { name: trimmedName, token: trimmedToken }];
    setAiModels(updated);
    await updateUser(u => {
      u.aiConfigRaw = JSON.stringify(updated);
    });
    setNewModelName('');
    setNewModelToken('');
    modalRef.current?.closeModal();
  }, [newModelName, newModelToken, aiModels, updateUser]);

  const handleRemoveModel = useCallback(
    async (index: number) => {
      const updated = aiModels.filter((_, i) => i !== index);
      setAiModels(updated);
      await updateUser(u => {
        u.aiConfigRaw = JSON.stringify(updated);
      });
    },
    [aiModels, updateUser],
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

        {/* Notification time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Время уведомлений</Text>
          <Text style={styles.sectionHint}>
            Ежедневное напоминание о повторении карточек
          </Text>
          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleChangeHour(1)}>
                <Text style={styles.timeButtonText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{pad(hour)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleChangeHour(-1)}>
                <Text style={styles.timeButtonText}>▼</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeBlock}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleChangeMinute(5)}>
                <Text style={styles.timeButtonText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{pad(minute)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleChangeMinute(-5)}>
                <Text style={styles.timeButtonText}>▼</Text>
              </TouchableOpacity>
            </View>
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

          {aiModels.map((model, index) => (
            <View key={index} style={styles.modelCard}>
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.modelToken} numberOfLines={1}>
                  {model.token
                    ? '••••' + model.token.slice(-6)
                    : 'Без токена'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveModel(index)}>
                <XIcon width={16} height={16} color={Colors.backgroundAccent4} />
              </TouchableOpacity>
            </View>
          ))}

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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  timeBlock: {
    alignItems: 'center',
    gap: 4,
  },
  timeButton: {
    width: 44,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    ...TextSizes.small,
    color: Colors.primary,
    fontWeight: FontWeights.bold,
  },
  timeValue: {
    ...TextSizes.xxlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    minWidth: 48,
    textAlign: 'center',
  },
  timeSeparator: {
    ...TextSizes.xxlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginHorizontal: 4,
  },
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    padding: 12,
    borderRadius: 12,
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
  modelToken: {
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
