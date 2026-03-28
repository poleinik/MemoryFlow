# MemoryFlow — AI Context

Мобильное приложение для интервального повторения (flashcards) с AI-генерацией карточек через Ollama API.

## Стек технологий

| Категория | Технология | Версия |
|-----------|-----------|--------|
| Фреймворк | React Native | 0.83.1 |
| Язык | TypeScript | 5.9+ |
| React | React | 19.2.0 |
| БД | WatermelonDB (SQLite) | 0.28.0 |
| Стейт | Zustand | 5.0.11 |
| Навигация | React Navigation (native-stack, bottom-tabs) | 7.x |
| Уведомления | Notifee | 9.1.8 |
| Жесты | react-native-gesture-handler | 2.30+ |
| SVG | react-native-svg | 15.15+ |
| Алгоритм повторения | supermemo (npm) | 2.0.23 |

**Node.js** >= 20.

## Команды

```bash
npm run android       # Запуск на Android
npm run ios           # Запуск на iOS
npm start             # Metro bundler
npm test              # Jest тесты
npm run lint          # ESLint
npm run format        # Prettier
npm run format:check  # Проверка форматирования
```

## Структура проекта

```
App.tsx                         # Точка входа: DatabaseProvider → SafeAreaProvider → Navigation
src/
├── model/                      # WatermelonDB: схема, модели, миграции
│   ├── schema.tsx              # Определение таблиц (user, themes, cards, review_log)
│   ├── Cards.tsx               # Модель Card
│   ├── Themes.tsx              # Модель Theme
│   ├── User.tsx                # Модель User (синглтон)
│   ├── ReviewLog.tsx           # Модель ReviewLog
│   ├── consts.ts               # Константы статусов и рейтингов
│   ├── migrations.tsx          # Миграции БД
│   └── index.tsx               # Инициализация database
├── api/                        # Хуки для работы с данными (CRUD + AI)
│   ├── useCreateCard.ts        # Создание одной карточки
│   ├── useCreateCards.ts       # Батч-создание карточек
│   ├── useCreateTheme.ts       # Создание темы
│   ├── useDeleteCard.ts        # Каскадное удаление карточки (+ review_log)
│   ├── useDeleteTheme.ts       # Каскадное удаление темы (+ cards + review_log)
│   ├── useFetchThemes.ts       # Получение всех тем
│   ├── useGenerateCardQa.ts    # Генерация Q&A через Ollama API
│   └── useUpdateCard.ts        # Обновление карточки (данные + SM-2 поля)
├── hooks/                      # Кастомные хуки
│   ├── useGetTheme.ts          # Загрузка темы + её карточек в стор
│   ├── useGetThemes.ts         # Загрузка всех тем в стор
│   ├── useStatistics.ts        # Расчёт статистики (стрик, точность, графики)
│   └── useTabSwipe.ts          # Свайп-навигация между табами
├── store/                      # Zustand сторы
│   ├── useThemesStore.ts       # Массив всех тем
│   └── useThemeStore.ts        # Текущая тема + её карточки
├── screens/                    # Экраны приложения
│   ├── theme/                  # Главный экран — список тем
│   │   ├── ThemeScreen.tsx
│   │   └── components/         # TodayBoard, ThemeBoard (drag-to-delete), ThemeCard, CreateThemeModal, StartRepeatBtn
│   ├── themeDetail/            # Детальный экран темы — список карточек
│   │   ├── ThemeDetailScreen.tsx
│   │   ├── components/         # AICreation, CardComponent, CreateAICardModal, Progress
│   │   └── CreateCardModal/
│   ├── repeat/                 # Экран повторения — FlipCard с оценками
│   ├── statistic/              # Экран статистики — графики и метрики
│   ├── profile/                # Профиль — аватар, уведомления, AI модели
│   └── components/             # Общий Header
├── components/                 # Переиспользуемые UI-компоненты
│   ├── FlipCard/               # 3D-переворот карточки (Animated, 360°)
│   ├── ExpandableCard/         # Раскрытие карточки на весь экран
│   ├── ExpandableFlipCard/     # Комбинация expand + flip
│   ├── SwipeNavigationView/    # Обёртка для свайп-жестов между табами
│   ├── BottomSheet/            # Модальная панель снизу (drag to close)
│   ├── TouchableScale/         # Кнопка с пружинной анимацией
│   ├── Modal/                  # Портал-модалка
│   └── InputWithLabel/         # Текстовое поле с лейблом
├── services/
│   └── notifications/          # Notifee: напоминания о повторении
├── config/
│   └── ollama.local.ts         # Конфиг Ollama API (endpoint, ключ)
├── constants/
│   ├── PaletteColors.tsx       # 6 цветов тем + light-варианты
│   └── icons/                  # Маппинг иконок для тем
├── utils/
│   └── supermemo.ts            # Обёртка над supermemo: маппинг рейтингов → grades
└── styles.tsx                  # Глобальные стили, типографика, Layout-токены
assets/                         # SVG-иконки как React-компоненты (react-native-svg, включая TrashIcon)
```

## Схема базы данных (WatermelonDB)

### user
| Поле | Тип | Описание |
|------|-----|----------|
| name | string | Имя пользователя |
| email | string | Email |
| avatar_uri | string | URI аватарки |
| notification_hour | number | Час уведомления |
| notification_minute | number | Минута уведомления |
| ai_config | string (JSON) | Массив кастомных AI-моделей `[{name, token}]` |
| created_at | number | Timestamp создания |

### themes
| Поле | Тип | Описание |
|------|-----|----------|
| title | string | Название |
| description | string | Описание |
| status | string | NEW / IN_PROGRESS / COMPLETED / REPEATING |
| color | string | Цвет из PaletteColors |
| icon | string | Ключ иконки |
| created_at | number | Timestamp создания |

### cards
| Поле | Тип | Описание |
|------|-----|----------|
| theme_id | string (FK) | Связь с темой |
| question | string | Вопрос |
| answer | string | Ответ |
| status | string | NEW / LEARNING / MASTERED |
| interval | number | Интервал повторения (дни) |
| ease_factor | number | Фактор лёгкости (SM-2, начальное: 2.5) |
| repetitions | number | Количество повторений |
| next_review_at | number | Timestamp следующего повторения |
| is_notification_sended | boolean | Отправлено ли уведомление |

### review_log
| Поле | Тип | Описание |
|------|-----|----------|
| card_id | string (FK) | Связь с карточкой |
| theme_id | string (FK) | Связь с темой |
| reviewed_at | number | Timestamp ревью |
| rating | string | AGAIN / HARD / GOOD / EASY |
| is_correct | boolean | Правильный ли ответ |
| duration_ms | number | Время ответа в мс |

## Бизнес-логика

### Алгоритм SuperMemo (SM-2)

Используется пакет `supermemo`. Маппинг рейтингов на grades:
- **again** → 1 (полный провал)
- **hard** → 3 (вспомнил с трудом)
- **good** → 4 (правильно с усилием)
- **easy** → 5 (мгновенный ответ)

Продвижение статуса карточки:
- `repetitions < 5` → статус LEARNING
- `repetitions >= 5` → статус MASTERED

### Флоу повторения

1. Выборка карточек: NEW + карточки с `next_review_at <= Date.now()`
2. Сортировка: сначала самые старые
3. Показ FlipCard → пользователь ставит оценку
4. Запись в review_log (с duration_ms)
5. Обновление Card через SuperMemo (interval, ease_factor, repetitions, next_review_at)
6. Перепланирование уведомлений

### Удаление

- **Тема**: drag-to-delete в ThemeBoard (longPress → перетаскивание в зону удаления внизу → Alert-подтверждение). Также кнопка-корзина в хедере ThemeDetailScreen.
- **Карточка**: кнопка-корзина на каждой карточке в ThemeDetailScreen → Alert-подтверждение.
- Каскадное удаление: тема → все cards → все review_log записи. Карточка → все review_log записи.
- Хуки: `useDeleteTheme`, `useDeleteCard` — batch `prepareDestroyPermanently()` внутри `database.write()`.

### AI-генерация карточек (Ollama)

- Endpoint и API-ключ в `src/config/ollama.local.ts`
- Дефолтные модели: `qwen3.5:397b-cloud`, `deepseek-v3.1:671b-cloud`
- Пользователь может добавлять свои модели в Профиле (хранятся в `user.ai_config`)
- Fallback-цепочка: пользовательские модели → дефолтные
- Промпт на русском → ответ в формате JSON `[{"question": "...", "answer": "..."}]`
- Ретрай при `model_not_found`

## Навигация

```
BottomTabs
├── Theme (Stack)
│   ├── ThemeMain → ThemeScreen (список тем + TodayBoard)
│   └── ThemeDetail → ThemeDetailScreen (карточки темы + AI-генерация)
├── Repeat → RepeatScreen (FlipCard + рейтинги)
├── Statistic → StatisticScreen (стрик, графики, хитмап)
└── Profile → ProfileScreen (аватар, уведомления, AI-модели)
```

Между табами работает свайп-навигация (SwipeNavigationView, minDistance=72px).

## Архитектурные паттерны

- **Data flow**: WatermelonDB → fetch в хуке → Zustand store → React-компонент (через `useShallow`)
- **CRUD-хуки** (`src/api/`): каждая операция — отдельный хук, возвращает функцию. Все записи через `database.write()`
- **Запросы к БД**: через `Q.where()`, `Q.and()`, `Q.lte()`, `Q.gte()`
- **Модалки**: через `useRef` + императивные хендлы (`open()`/`close()`)
- **Анимации**: React Native Animated API (`Animated.Value`, `Animated.timing`, `Animated.spring`)
- **SVG-иконки**: каждая иконка — React-компонент в `assets/`, принимает `width`, `height`, `color`

## Конвенции кода

- **Файловая структура**: каждый компонент в своей папке с `index.tsx`
- **Экраны**: каждый экран в отдельной папке (`screens/<name>/`) с подпапками `components/` и `hooks/`
- **Именование**: PascalCase для компонентов, camelCase для хуков и утилит
- **Хуки**: префикс `use` (useCreateCard, useGetTheme, useFetchThemes)
- **Стили**: `StyleSheet.create()` в конце файла или в отдельном `styles.tsx`
- **Path aliases**: `src/*` и `assets/*` (настроены в tsconfig + babel module-resolver)
- **Декораторы**: WatermelonDB модели используют `@field`, `@text`, `@date`, `@readonly`
- **Язык интерфейса**: русский

## Дизайн-система

**Цвета тем**: blue (#3B82F6), green, amber, purple, rose, cyan — каждый с light-вариантом.

**Типографика** (src/styles.tsx):
- xsmall: 12, small: 14, medium: 16, large: 18, xlarge: 20, xxlarge: 24
- Веса: 400, 500, 600, 700

**Layout**: padding horizontal 16, vertical gap 24, borderRadius 12.

## Уведомления

- Библиотека: Notifee
- Канал: `review-reminders` (HIGH importance)
- Триггер: `TimestampTrigger` по времени пользователя (`notification_hour:notification_minute`)
- Группировка карточек, количество в тексте уведомления
- Флаг `is_notification_sended` предотвращает дубликаты
- Перепланирование после каждого ревью
