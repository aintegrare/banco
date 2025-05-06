import { getSupabaseClient } from "@/lib/supabase/client"

export async function fetchFolderTaskCounts(folderPaths: string[]): Promise<Record<string, number>> {
  try {
    if (!folderPaths || folderPaths.length === 0) {
      return {}
    }

    const supabase = getSupabaseClient()

    // Buscar todas as tarefas não completas para as pastas especificadas
    const { data, error } = await supabase
      .from("folder_tasks")
      .select("folder_path, is_completed")
      .in("folder_path", folderPaths)

    if (error) {
      console.error("Erro ao buscar contagens de tarefas:", error)
      return {}
    }

    // Calcular a contagem de tarefas não completadas por pasta
    const counts: Record<string, number> = {}

    // Inicializar contagens com zero para todas as pastas
    folderPaths.forEach((path) => {
      counts[path] = 0
    })

    // Contar tarefas não completadas
    data?.forEach((task) => {
      if (!task.is_completed) {
        counts[task.folder_path] = (counts[task.folder_path] || 0) + 1
      }
    })

    return counts
  } catch (error) {
    console.error("Erro ao buscar contagens de tarefas:", error)
    return {}
  }
}
