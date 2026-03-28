export type TodayGreetingInput = {
  pendingReviewCount: number;
  userName: string | null;
};

export const pluralizeReviewCards = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'карточка';
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'карточки';
  }

  return 'карточек';
};

export const buildTodayGreetingPrompt = ({
  pendingReviewCount,
  userName,
}: TodayGreetingInput) => {
  const trimmedName = userName?.trim() || '';
  const nameInstruction = trimmedName
    ? `Обязательно обратись к пользователю по имени: ${trimmedName}.`
    : 'Имя пользователя не задано, не придумывай обращение по имени.';

  const reviewInstruction = pendingReviewCount > 0
    ? `Скажи, что сегодня нужно повторить ${pendingReviewCount} ${pluralizeReviewCards(pendingReviewCount)}.`
    : 'Скажи, что карточек на сегодня не осталось, и похвали пользователя за прогресс.';

  return `Ты дружелюбный AI-тьютор в приложении для обучения MemoryFlow.

Сгенерируй короткое сообщение для главного экрана на русском языке.
${nameInstruction}
${reviewInstruction}

Требования:
- 2 или 3 коротких предложения
- максимум 180 символов
- заканчивай мотивирующей фразой
- без списков, без markdown, без кавычек, без эмодзи
- текст должен звучать тепло, но без пафоса`;
};

export const getTodayGreetingFallback = ({
  pendingReviewCount,
  userName,
}: TodayGreetingInput) => {
  const greeting = userName?.trim() ? `${userName?.trim()}, ` : '';

  if (pendingReviewCount <= 0) {
    return `${greeting}сегодня карточек больше не осталось. Отличная работа, вы держите темп. Продолжайте в том же духе.`;
  }

  return `${greeting}сегодня вас ждут ${pendingReviewCount} ${pluralizeReviewCards(pendingReviewCount)} для повторения. Ещё один подход, и материал закрепится сильнее.`;
};

export const sanitizeTodayGreeting = (value: string) => {
  return value.replace(/^['"\s]+|['"\s]+$/g, '').replace(/\s+/g, ' ').trim();
};