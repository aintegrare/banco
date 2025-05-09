import { getSupabaseClient } from "@/lib/supabase/client"

interface TaskCount {
  pending: number
  overdue: number
}

export async function fetchFolderTaskCounts(folderPaths: string[]): Promise<Record<string, TaskCount>> {
  try {
    if (!folderPaths || folderPaths.length === 0) {
      return {}
    }

    const supabase = getSupabaseClient()
    const now = new Date().toISOString()

    // Criar condições OR para cada caminho (com e sem barra no final)
    const pathConditions = folderPaths
      .flatMap((path) => [`folder_path.eq.${path}`, `folder_path.eq.${path}/`])
      .join(",")

    // Buscar todas as tarefas não completas para as pastas especificadas
    const { data, error } = await supabase
      .from("folder_tasks")
      .select("folder_path, is_completed, due_date")
      .or(pathConditions)
      .eq("is_completed", false)

    if (error) {
      console.error("Erro ao buscar contagens de tarefas:", error)
      return {}
    }

    // Calcular a contagem de tarefas não completadas e vencidas por pasta
    const counts: Record<string, TaskCount> = {}

    // Inicializar contagens com zero para todas as pastas
    folderPaths.forEach((path) => {
      counts[path] = { pending: 0, overdue: 0 }
    })

    // Contar tarefas não completadas e verificar se estão vencidas
    data?.forEach((task) => {
      // Normalizar o caminho da pasta (remover barra final se existir)
      const folderPath = task.folder_path.endsWith("/") ? task.folder_path.slice(0, -1) : task.folder_path

      // Encontrar o caminho correspondente nos folderPaths
      const matchingPath = folderPaths.find((path) => path === folderPath || path === folderPath + "/")

      if (matchingPath) {
        // Incrementar contagem de tarefas pendentes
        counts[matchingPath].pending += 1

        // Verificar se a tarefa está vencida
        if (task.due_date && new Date(task.due_date) < new Date(now)) {
          counts[matchingPath].overdue += 1
        }
      }
    })

    return counts
  } catch (error) {
    console.error("Erro ao buscar contagens de tarefas:", error)
    return {}
  }
}
