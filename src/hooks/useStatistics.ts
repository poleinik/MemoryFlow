import { useState, useCallback } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database } from 'src/model';
import ReviewLog from 'src/model/ReviewLog';
import Theme from 'src/model/Themes';

export type DayStats = {
  date: string;
  count: number;
};

export type ThemeStats = {
  title: string;
  color: string;
  count: number;
  percentage: number;
};

export type Statistics = {
  streak: number;
  todayCards: number;
  todayTimeMinutes: number;
  todayAccuracy: number;
  weekDays: DayStats[];
  weekTotal: number;
  weekAverage: number;
  themeDistribution: ThemeStats[];
  calendarData: Map<string, number>;
  calendarMonth: Date;
};

const getStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);

    const reviewLogCollection = database.get<ReviewLog>('review_log');

    const now = new Date();
    const todayStart = getStartOfDay(now);
    const todayTimestamp = todayStart.getTime();

    // Today's reviews
    const todayLogs = await reviewLogCollection
      .query(Q.where('reviewed_at', Q.gte(todayTimestamp)))
      .fetch();

    const todayCards = todayLogs.length;
    const todayTimeMs = todayLogs.reduce((sum, log) => sum + log.durationMs, 0);
    const todayTimeMinutes = Math.round(todayTimeMs / 60000);
    const todayCorrect = todayLogs.filter(log => log.isCorrect).length;
    const todayAccuracy = todayCards > 0 ? Math.round((todayCorrect / todayCards) * 100) : 0;

    // Week stats (Mon-Sun)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = getStartOfDay(now);
    weekStart.setDate(weekStart.getDate() - mondayOffset);
    const weekTimestamp = weekStart.getTime();

    const weekLogs = await reviewLogCollection
      .query(Q.where('reviewed_at', Q.gte(weekTimestamp)))
      .fetch();

    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const weekDays: DayStats[] = dayNames.map((name, i) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + i);
      const dayKey = formatDateKey(dayDate);
      const count = weekLogs.filter(log => formatDateKey(log.reviewedAt) === dayKey).length;
      return { date: name, count };
    });

    const weekTotal = weekLogs.length;
    const daysPassedInWeek = mondayOffset + 1;
    const weekAverage = daysPassedInWeek > 0 ? Math.round(weekTotal / daysPassedInWeek) : 0;

    // Streak calculation
    let streak = 0;
    const checkDate = new Date(todayStart);
    if (todayCards === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dayStart = getStartOfDay(checkDate).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayLogs = await reviewLogCollection
        .query(
          Q.and(
            Q.where('reviewed_at', Q.gte(dayStart)),
            Q.where('reviewed_at', Q.lt(dayEnd)),
          ),
        )
        .fetch();

      if (dayLogs.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Theme distribution
    const allLogs = await reviewLogCollection.query().fetch();
    const themeCounts: Record<string, number> = {};
    for (const log of allLogs) {
      themeCounts[log.themeId] = (themeCounts[log.themeId] || 0) + 1;
    }

    const themes = await database.get<Theme>('themes').query().fetch();
    const themeMap = new Map(themes.map(t => [t.id, t]));
    const totalReviews = allLogs.length;

    const sortedThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a);

    const themeDistribution: ThemeStats[] = [];
    const topThemes = sortedThemes.slice(0, 3);
    const otherThemes = sortedThemes.slice(3);

    for (const [themeId, count] of topThemes) {
      const theme = themeMap.get(themeId);
      themeDistribution.push({
        title: theme?.title ?? 'Без темы',
        color: theme?.color ?? '#3B82F6',
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
      });
    }

    if (otherThemes.length > 0) {
      const otherCount = otherThemes.reduce((sum, [, c]) => sum + c, 0);
      themeDistribution.push({
        title: 'Другие',
        color: '#3B82F6',
        count: otherCount,
        percentage: totalReviews > 0 ? Math.round((otherCount / totalReviews) * 100) : 0,
      });
    }

    // Calendar data for current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthLogs = await reviewLogCollection
      .query(
        Q.and(
          Q.where('reviewed_at', Q.gte(monthStart.getTime())),
          Q.where('reviewed_at', Q.lte(monthEnd.getTime())),
        ),
      )
      .fetch();

    const calendarData = new Map<string, number>();
    for (const log of monthLogs) {
      const key = formatDateKey(log.reviewedAt);
      calendarData.set(key, (calendarData.get(key) || 0) + 1);
    }

    setStatistics({
      streak,
      todayCards,
      todayTimeMinutes,
      todayAccuracy,
      weekDays,
      weekTotal,
      weekAverage,
      themeDistribution,
      calendarData,
      calendarMonth: now,
    });

    setIsLoading(false);
  }, []);

  return { statistics, isLoading, fetch };
}
