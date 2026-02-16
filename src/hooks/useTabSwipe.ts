import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const TAB_ROUTES = ['Theme', 'Repeat', 'Statistic', 'Profile'] as const;

type TabRoute = (typeof TAB_ROUTES)[number];

export const useTabSwipe = (currentRoute: TabRoute) => {
  const navigation = useNavigation();

  const onSwipeLeft = useCallback(() => {
    const currentIndex = TAB_ROUTES.indexOf(currentRoute);
    const nextRoute = TAB_ROUTES[currentIndex + 1];
    if (!nextRoute) return;
    navigation.navigate(nextRoute as never);
  }, [currentRoute, navigation]);

  const onSwipeRight = useCallback(() => {
    const currentIndex = TAB_ROUTES.indexOf(currentRoute);
    const previousRoute = TAB_ROUTES[currentIndex - 1];
    if (!previousRoute) return;
    navigation.navigate(previousRoute as never);
  }, [currentRoute, navigation]);

  return { onSwipeLeft, onSwipeRight };
};
