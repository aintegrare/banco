/**
 * Garante que o valor é sempre um array válido
 */
export function ensureArray<T>(value: any): T[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === "object") {
    // Tentar extrair array de propriedades conhecidas
    if (value.data && Array.isArray(value.data)) {
      return value.data
    }
    if (value.tasks && Array.isArray(value.tasks)) {
      return value.tasks
    }
    if (value.items && Array.isArray(value.items)) {
      return value.items
    }

    // Se for um objeto, tentar encontrar o primeiro array
    const arrayValues = Object.values(value).filter(Array.isArray)
    if (arrayValues.length > 0) {
      return arrayValues[0] as T[]
    }
  }

  // Se não conseguir extrair array, retornar array vazio
  console.warn("Valor não é array, retornando array vazio:", typeof value, value)
  return []
}

/**
 * Valida e normaliza uma tarefa
 */
export function validateTask(task: any): Task | null {
  if (!task || typeof task !== "object") {
    return null
  }

  const id = Number.parseInt(task.id?.toString() || "0", 10)
  if (isNaN(id) || id <= 0) {
    return null
  }

  return {
    id,
    title: task.title || "Sem título",
    description: task.description || null,
    status: task.status || "todo",
    priority: task.priority || "medium",
    project_id: task.project_id ? Number.parseInt(task.project_id.toString(), 10) : null,
    due_date: task.due_date || null,
    created_at: task.created_at || new Date().toISOString(),
    updated_at: task.updated_at || new Date().toISOString(),
  }
}

/**
 * Valida e normaliza array de tarefas
 */
export function validateTasks(data: any): Task[] {
  const arrayData = ensureArray(data)

  return arrayData.map(validateTask).filter((task): task is Task => task !== null)
}

interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  priority?: string
  project_id?: number | null
  due_date?: string | null
  created_at?: string
  updated_at?: string
}
