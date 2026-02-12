import { useFetchThemes } from 'src/api/useFetchThemes';
import { useThemesStore } from 'src/store/useThemesStore';
import { useCallback } from 'react';

export const useGetThemes = () => {
  const { fetchThemes } = useFetchThemes();
  const { themes, setThemes } = useThemesStore();
  const fetch = useCallback(async () => {
    console.log('fetching themes...');
    const fetchedThemes = (await fetchThemes()).reverse();
    setThemes(fetchedThemes);
  }, [fetchThemes, setThemes]);
  return { themes, fetch };
};
