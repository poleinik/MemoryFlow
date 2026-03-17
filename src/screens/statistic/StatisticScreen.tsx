import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SwipeNavigationView from 'src/components/SwipeNavigationView';
import { useTabSwipe } from 'src/hooks/useTabSwipe';
import { useStatistics } from 'src/hooks/useStatistics';
import { Colors, FontWeights, TextSizes, layout } from 'src/styles';
import RepeatIcon from 'assets/RepeatIcon';
import BarChartIcon from 'assets/BarChartIcon';
import ClockIcon from 'assets/ClockIcon';
import CheckIcon from 'assets/CheckIcon';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const DAY_HEADERS = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getHeatmapColor = (count: number, maxCount: number): string => {
  if (count === 0) return '#f0f0f0';
  const ratio = maxCount > 0 ? count / maxCount : 0;
  if (ratio <= 0.25) return '#c6f0d8';
  if (ratio <= 0.5) return '#7be0a4';
  if (ratio <= 0.75) return '#34c770';
  return '#10b981';
};

function StatCard({
  icon,
  label,
  value,
  subtitle,
  backgroundColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  backgroundColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor }]}>
      <View style={styles.statCardHeader}>
        {icon}
        <Text style={styles.statCardLabel}>{label}</Text>
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function StatisticScreen() {
  const { onSwipeLeft, onSwipeRight } = useTabSwipe('Statistic');
  const { statistics, fetch } = useStatistics();
  const { width: screenWidth } = useWindowDimensions();

  // 16 padding on each side of screen + 16 padding inside section = 64 total
  const calendarPadding = 64;
  const calendarGap = 6;
  const cellSize = Math.floor((screenWidth - calendarPadding - calendarGap * 6) / 7);

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [fetch]),
  );

  const maxBarCount = statistics
    ? Math.max(...statistics.weekDays.map(d => d.count), 1)
    : 1;

  const calendarCells = (() => {
    if (!statistics) return [];
    const { calendarMonth, calendarData } = statistics;
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    const maxCount = Math.max(...calendarData.values(), 1);
    const cells: { day: number | null; color: string; isToday: boolean }[] = [];

    for (let i = 0; i < startDow; i++) {
      cells.push({ day: null, color: 'transparent', isToday: false });
    }

    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = formatDateKey(date);
      const count = calendarData.get(key) || 0;
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      cells.push({
        day: d,
        color: getHeatmapColor(count, maxCount),
        isToday,
      });
    }

    return cells;
  })();

  return (
    <SwipeNavigationView onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
      <ScrollView style={layout.container} contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
        <Text style={layout.header1}>Статистика</Text>

        {/* Stats Cards 2x2 */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              icon={<RepeatIcon width={16} height={16} color="#fff" />}
              label="СЕРИЯ"
              value={String(statistics?.streak ?? 0)}
              subtitle="дней подряд"
              backgroundColor={Colors.primary}
            />
            <StatCard
              icon={<BarChartIcon width={16} height={16} color="#fff" />}
              label="СЕГОДНЯ"
              value={String(statistics?.todayCards ?? 0)}
              subtitle="карточек"
              backgroundColor={Colors.backgroundAccent}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={<ClockIcon width={16} height={16} color="#fff" />}
              label="ВРЕМЯ"
              value={`${statistics?.todayTimeMinutes ?? 0}м`}
              subtitle="сегодня"
              backgroundColor={Colors.backgroundAccent2}
            />
            <StatCard
              icon={<CheckIcon width={16} height={16} color="#fff" />}
              label="ТОЧНОСТЬ"
              value={`${statistics?.todayAccuracy ?? 0}%`}
              subtitle="правильных"
              backgroundColor={Colors.backgroundAccent}
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Эта неделя</Text>
          <View style={styles.weekChart}>
            {statistics?.weekDays.map((day, i) => (
              <View key={i} style={styles.weekBarColumn}>
                <View style={styles.weekBarTrack}>
                  <View
                    style={[
                      styles.weekBarFill,
                      {
                        height: `${maxBarCount > 0 ? (day.count / maxBarCount) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weekBarLabel}>{day.date}</Text>
              </View>
            ))}
          </View>
          <View style={styles.weekSummary}>
            <View>
              <Text style={styles.weekSummaryLabel}>Всего за неделю</Text>
              <Text style={styles.weekSummaryValue}>{statistics?.weekTotal ?? 0}</Text>
            </View>
            <View style={styles.weekSummaryRight}>
              <Text style={styles.weekSummaryLabel}>В среднем</Text>
              <Text style={styles.weekSummaryValue}>{statistics?.weekAverage ?? 0} / день</Text>
            </View>
          </View>
        </View>

        {/* Theme Distribution */}
        {statistics && statistics.themeDistribution.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>По темам</Text>
            {statistics.themeDistribution.map((theme, i) => (
              <View key={i} style={styles.themeRow}>
                <View style={styles.themeHeader}>
                  <Text style={styles.themeTitle}>{theme.title}</Text>
                  <Text style={[styles.themePercent, { color: theme.color }]}>
                    {theme.percentage}%
                  </Text>
                </View>
                <View style={styles.themeBarTrack}>
                  <View
                    style={[
                      styles.themeBarFill,
                      {
                        width: `${theme.percentage}%`,
                        backgroundColor: theme.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Calendar Heatmap */}
        {statistics ? (
          <View style={[styles.section, { marginBottom: 32 }]}>
            <Text style={styles.sectionTitle}>
              {MONTH_NAMES[statistics.calendarMonth.getMonth()]}{' '}
              {statistics.calendarMonth.getFullYear()}
            </Text>
            <View style={styles.calendarHeader}>
              {DAY_HEADERS.map((d, i) => (
                <Text key={i} style={[styles.calendarDayHeader, { width: cellSize }]}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={[styles.calendarGrid, { gap: calendarGap }]}>
              {calendarCells.map((cell, i) => (
                <View
                  key={i}
                  style={[
                    styles.calendarCell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cell.day ? cell.color : 'transparent',
                    },
                    cell.isToday && styles.calendarCellToday,
                  ]}
                >
                  {cell.day ? (
                    <Text
                      style={[
                        styles.calendarCellText,
                        cell.isToday && styles.calendarCellTextToday,
                      ]}
                    >
                      {cell.day}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SwipeNavigationView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statCardLabel: {
    ...TextSizes.xsmall,
    fontWeight: FontWeights.semibold,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  statCardValue: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: FontWeights.bold,
    color: '#fff',
  },
  statCardSubtitle: {
    ...TextSizes.xsmall,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: FontWeights.medium,
  },

  section: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    ...TextSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  weekBarColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    height: '100%',
  },
  weekBarTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFill: {
    width: '100%',
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 6,
    minHeight: 4,
  },
  weekBarLabel: {
    ...TextSizes.xsmall,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
  weekSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingTop: 12,
  },
  weekSummaryRight: {
    alignItems: 'flex-end',
  },
  weekSummaryLabel: {
    ...TextSizes.xsmall,
    color: Colors.textTertiary,
    fontWeight: FontWeights.medium,
    marginBottom: 4,
  },
  weekSummaryValue: {
    ...TextSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  themeRow: {
    gap: 8,
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeTitle: {
    ...TextSizes.medium,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  themePercent: {
    ...TextSizes.medium,
    fontWeight: FontWeights.bold,
  },
  themeBarTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  themeBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  calendarDayHeader: {
    textAlign: 'center',
    ...TextSizes.xsmall,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarCellToday: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  calendarCellText: {
    ...TextSizes.small,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  calendarCellTextToday: {
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
});
