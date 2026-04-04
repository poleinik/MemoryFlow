import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Q } from '@nozbe/watermelondb';
import { database } from 'src/model';
import Card from 'src/model/Cards';
import User from 'src/model/User';

const REVIEW_CHANNEL_ID = 'review-reminders';
const REVIEW_TRIGGER_NOTIFICATION_ID = 'review-reminder-next';
const REPEAT_OVERDUE_NOTIFICATION_ID = 'review-reminder-repeat-overdue';
const DAY_MS = 24 * 60 * 60 * 1000;

const pluralizeCards = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'карточку';
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'карточки';
  }

  return 'карточек';
};

const ensureNotificationSetup = async () => {
  await notifee.requestPermission();

  await notifee.createChannel({
    id: REVIEW_CHANNEL_ID,
    name: 'Повторение карточек',
    importance: AndroidImportance.HIGH,
  });
};

const getDueUnsentCards = async (now: number) => {
  return database
    .get<Card>('cards')
    .query(
      Q.where('is_notification_sended', false),
      Q.where('next_review_at', Q.lte(now)),
    )
    .fetch();
};

const getFutureUnsentCards = async (now: number) => {
  return database
    .get<Card>('cards')
    .query(
      Q.where('is_notification_sended', false),
      Q.where('next_review_at', Q.gt(now)),
    )
    .fetch();
};

const getUserName = async (): Promise<string | null> => {
  const users = await database.get<User>('user').query().fetch();
  const name = users[0]?.name?.trim();
  return name || null;
};

const markCardsAsNotified = async (cards: Card[]) => {
  if (cards.length === 0) {
    return;
  }

  await database.write(async () => {
    await Promise.all(
      cards.map(card =>
        card.update(record => {
          record.isNotificationSended = true;
        }),
      ),
    );
  });
};

/**
 * Сбрасывает флаг уведомления у карточек, которые уже были уведомлены,
 * но так и не были повторены — если прошло больше 24 часов.
 */
const resetStaleNotifiedCards = async (now: number) => {
  const staleCards = await database
    .get<Card>('cards')
    .query(
      Q.where('is_notification_sended', true),
      Q.where('next_review_at', Q.lte(now - DAY_MS)),
    )
    .fetch();

  if (staleCards.length === 0) {
    return;
  }

  await database.write(async () => {
    await Promise.all(
      staleCards.map(card =>
        card.update(record => {
          record.isNotificationSended = false;
        }),
      ),
    );
  });
};

/**
 * Планирует повторное фоновое уведомление через 24 часа для карточек,
 * которые были уведомлены, но пользователь их так и не повторил.
 */
const scheduleRepeatOverdueReminder = async (count: number, userName: string | null, now: number) => {
  if (count === 0) {
    await notifee.cancelNotification(REPEAT_OVERDUE_NOTIFICATION_ID);
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: now + DAY_MS,
  };

  await notifee.createTriggerNotification(
    {
      id: REPEAT_OVERDUE_NOTIFICATION_ID,
      title: userName
        ? `${userName}, карточки всё ещё ждут повторения`
        : 'Карточки всё ещё ждут повторения',
      body: `${count} ${pluralizeCards(count)} готово к повторению. Не откладывай!`,
      android: {
        channelId: REVIEW_CHANNEL_ID,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );
};

const notifyDueCards = async (count: number, userName: string | null) => {
  const title = userName
    ? `${userName}, пора повторить карточки`
    : 'Пора повторить карточки';
  await notifee.displayNotification({
    title,
    body: `Сейчас доступно ${count} ${pluralizeCards(count)} для повторения.`,
    android: {
      channelId: REVIEW_CHANNEL_ID,
      pressAction: {
        id: 'default',
      },
    },
  });
};

const scheduleNextReminder = async (now: number, userName: string | null) => {
  const futureCards = await getFutureUnsentCards(now);

  if (futureCards.length === 0) {
    await notifee.cancelNotification(REVIEW_TRIGGER_NOTIFICATION_ID);
    return;
  }

  const nearestCard = futureCards.reduce((nearest, card) => {
    const nearestTime = nearest.nextReviewAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const cardTime = card.nextReviewAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return cardTime < nearestTime ? card : nearest;
  }, futureCards[0]);

  const nextTimestamp = nearestCard.nextReviewAt?.getTime();
  if (!nextTimestamp) {
    await notifee.cancelNotification(REVIEW_TRIGGER_NOTIFICATION_ID);
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: nextTimestamp,
  };

  await notifee.createTriggerNotification(
    {
      id: REVIEW_TRIGGER_NOTIFICATION_ID,
      title: userName
        ? `${userName}, пора повторить карточки`
        : 'Пора повторить карточки',
      body: 'Откройте приложение, чтобы узнать, сколько карточек вас ждёт.',
      android: {
        channelId: REVIEW_CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );
};

export const rescheduleReviewReminder = async () => {
  await ensureNotificationSetup();

  const now = Date.now();
  const userName = await getUserName();

  // Сбросить флаг у карточек, которые были уведомлены, но так и не повторены 24ч+
  await resetStaleNotifiedCards(now);

  const dueCards = await getDueUnsentCards(now);

  if (dueCards.length > 0) {
    await notifyDueCards(dueCards.length, userName);
    await markCardsAsNotified(dueCards);
    // Запланировать повторное уведомление через 24ч, если карточки так и не будут повторены
    await scheduleRepeatOverdueReminder(dueCards.length, userName, now);
  } else {
    await notifee.cancelNotification(REPEAT_OVERDUE_NOTIFICATION_ID);
  }

  await scheduleNextReminder(now, userName);
};

export const initializeReviewNotifications = async () => {
  await rescheduleReviewReminder();
};
