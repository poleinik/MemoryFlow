import { useCallback } from "react"
import { database } from "src/model"
import Theme from "src/model/Themes"
const StatusTheme = {
    NEW: "NEW",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    REPEATING: "REPEATING"
}
export const useCreateTheme = () => {
    const createTheme = useCallback(async (props:{title: string, description: string, color: string, icon: string}) => {
        const newTheme = await database.write(async () => {
            await database.get<Theme>('themes').create((theme) => {
                theme.title = props.title
                theme.description = props.description
                theme.color = props.color
                theme.icon = props.icon
                theme.status = StatusTheme.NEW
                theme.createdAt = new Date()
            })
        })
    }, [])

    return { createTheme }

}