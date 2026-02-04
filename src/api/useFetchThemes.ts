import { useCallback } from "react";
import { database } from "src/model";

export const useFetchThemes = () => {
    const fetchThemes = useCallback(async () => {
    // Логика получения тем
   const themes = await database.get('themes').query().fetch();
   console.log("Темы получены", themes);
   return themes;
    }, []);
    return { fetchThemes };
}