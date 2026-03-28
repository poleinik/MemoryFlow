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
  const dueCards = await getDueUnsentCards(now);

  if (dueCards.length > 0) {
    await notifyDueCards(dueCards.length, userName);
    await markCardsAsNotified(dueCards);
  }

  await scheduleNextReminder(now, userName);
};

export const initializeReviewNotifications = async () => {
  await rescheduleReviewReminder();
};
