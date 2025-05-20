import { createClient } from "@/lib/supabase/server"

// Tipos para o sistema de tarefas
export type TaskStatus = "pending" | "to_do" | "in_progress" | "review" | "done" | "backlog"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  priority: string
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  created_at?: string
  updated_at?: string
  estimated_hours?: number | null
  actual_hours?: number | null
  tags?: string[] | null
  order_position?: number | null
  subtasks?: any | null

  // Campos virtuais para o frontend
  color?: string
  creator?: string | null
  assignee?: string | null
}

export interface TaskFilter {
  project_id?: number
  status?: string
  priority?: string
  assigned_to?: number
  search?: string
  limit?: number
  offset?: number
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  status?: string
  priority?: string
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  estimated_hours?: number | null
  tags?: string[] | null
  order_position?: number | null

  // Campos virtuais para o frontend
  color?: string
  creator?: string | null
  assignee?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  status?: string
  priority?: string
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  estimated_hours?: number | null
  actual_hours?: number | null
  tags?: string[] | null
  order_position?: number | null
  subtasks?: any | null
}

// Mapeamento de status do frontend para o banco de dados
const frontendToDbStatusMap: Record<string, string> = {
  backlog: "Backlog",
  todo: "Pendente",
  "in-progress": "Em andamento",
  review: "Em revisão",
  done: "Concluído",
}

// Mapeamento de status do banco de dados para o frontend
const dbToFrontendStatusMap: Record<string, string> = {
  Backlog: "backlog",
  Pendente: "todo",
  "Em andamento": "in-progress",
  "Em revisão": "review",
  Concluído: "done",
}

// Mapeamento de prioridade do frontend para o banco de dados
const frontendToDbPriorityMap: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
}

// Mapeamento de prioridade do banco de dados para o frontend
const dbToFrontendPriorityMap: Record<string, string> = {
  Baixa: "low",
  Média: "medium",
  Alta: "high",
}

/**
 * Busca todas as tarefas com filtros opcionais
 */
export async function getTasks(filters: TaskFilter = {}): Promise<Task[]> {
  try {
    const supabase = createClient()
    let query = supabase.from("tasks").select("*")

    // Aplicar filtros
    if (filters.project_id) {
      console.log("Filtrando tarefas pelo projeto ID:", filters.project_id)
      query = query.eq("project_id", filters.project_id)
    }

    if (filters.status) {
      // Converter status do frontend para o formato do banco
      const dbStatus = frontendToDbStatusMap[filters.status] || filters.status
      query = query.eq("status", dbStatus)
    }

    if (filters.priority) {
      // Converter prioridade do frontend para o formato do banco
      const dbPriority = frontendToDbPriorityMap[filters.priority] || filters.priority
      query = query.eq("priority", dbPriority)
    }

    if (filters.assigned_to) {
      query = query.eq("assigned_to", filters.assigned_to)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Paginação
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Ordenação
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar tarefas:", error)
      throw new Error(error.message)
    }

    // Mapear os dados do banco para o formato do frontend
    return data.map(mapDbTaskToFrontend)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    throw error
  }
}

/**
 * Busca uma tarefa específica pelo ID
 */
export async function getTaskById(id: number): Promise<Task> {
  try {
    console.log(`Buscando tarefa com ID: ${id}`)
    const supabase = createClient()

    // Modificado para não usar .single() e tratar o resultado manualmente
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id)

    if (error) {
      console.error(`Erro ao buscar tarefa ${id}:`, error)
      throw new Error(error.message)
    }

    if (!data || data.length === 0) {
      console.error(`Tarefa com ID ${id} não encontrada`)
      throw new Error(`Tarefa com ID ${id} não encontrada`)
    }

    if (data.length > 1) {
      console.warn(`Múltiplas tarefas encontradas com ID ${id}, usando a primeira`)
    }

    // Usar o primeiro resultado encontrado
    const taskData = data[0]
    console.log(`Tarefa encontrada:`, taskData)

    // Mapear os dados do banco para o formato do frontend
    return mapDbTaskToFrontend(taskData)
  } catch (error: any) {
    console.error(`Erro ao buscar tarefa ${id}:`, error)
    throw new Error(`Erro ao buscar tarefa ${id}: ${error.message}`)
  }
}

/**
 * Cria uma nova tarefa
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const supabase = createClient()

    // Mapear os dados do frontend para o formato do banco
    const dbTask = mapFrontendTaskToDb(input)

    const { data, error } = await supabase.from("tasks").insert(dbTask).select().single()

    if (error) {
      console.error("Erro ao criar tarefa:", error)
      throw new Error(error.message)
    }

    // Mapear os dados do banco para o formato do frontend
    const frontendTask = mapDbTaskToFrontend(data)

    // Adicionar campos virtuais
    return {
      ...frontendTask,
      color: input.color || "#4b7bb5",
      creator: input.creator || null,
      assignee: input.assignee || null,
    }
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    throw error
  }
}

// Modificar a função updateTask para lidar corretamente com o campo updated_at
export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  try {
    const supabase = createClient()

    // Mapear os dados do frontend para o formato do banco
    const dbTask = mapFrontendTaskToDb(input)

    // Verificar se dbTask é um objeto válido antes de adicionar updated_at
    if (dbTask && typeof dbTask === "object") {
      // Adicionar timestamp de atualização
      dbTask.updated_at = new Date().toISOString()
    } else {
      console.warn("dbTask não é um objeto válido:", dbTask)
    }

    // Modificado para não usar .single() e tratar o resultado manualmente
    const { data, error } = await supabase.from("tasks").update(dbTask).eq("id", id).select()

    if (error) {
      console.error(`Erro ao atualizar tarefa ${id}:`, error)
      throw new Error(error.message)
    }

    if (!data || data.length === 0) {
      throw new Error(`Tarefa com ID ${id} não encontrada para atualização`)
    }

    // Usar o primeiro resultado encontrado
    const updatedData = data[0]

    // Mapear os dados do banco para o formato do frontend
    return mapDbTaskToFrontend(updatedData)
  } catch (error: any) {
    console.error(`Erro ao atualizar tarefa ${id}:`, error)
    throw new Error(`Erro ao atualizar tarefa ${id}: ${error.message}`)
  }
}

/**
 * Exclui uma tarefa
 */
export async function deleteTask(id: number): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir tarefa ${id}:`, error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Erro ao excluir tarefa ${id}:`, error)
    throw error
  }
}

// Adicionar uma função específica para atualizar apenas o status da tarefa
export async function updateTaskStatus(id: number, status: string): Promise<Task> {
  try {
    // Converter status do frontend para o formato do banco
    const dbStatus = frontendToDbStatusMap[status] || status
    console.log(`Atualizando status da tarefa ${id} para ${dbStatus} (de ${status})`)

    const supabase = createClient()

    // Usar um objeto simples com apenas os campos necessários
    const updateData = {
      status: dbStatus,
      updated_at: new Date().toISOString(),
    }

    // Modificado para não usar .single() e tratar o resultado manualmente
    const { data, error } = await supabase.from("tasks").update(updateData).eq("id", id).select()

    if (error) {
      console.error(`Erro ao atualizar status da tarefa ${id}:`, error)
      throw new Error(error.message)
    }

    if (!data || data.length === 0) {
      throw new Error(`Tarefa com ID ${id} não encontrada para atualização de status`)
    }

    // Usar o primeiro resultado encontrado
    const updatedData = data[0]

    // Mapear os dados do banco para o formato do frontend
    return mapDbTaskToFrontend(updatedData)
  } catch (error: any) {
    console.error(`Erro ao atualizar status da tarefa ${id}:`, error)
    throw new Error(`Erro ao atualizar status da tarefa ${id}: ${error.message}`)
  }
}

/**
 * Mapeia uma tarefa do formato do banco para o formato do frontend
 */
function mapDbTaskToFrontend(dbTask: any): Task {
  if (!dbTask) return {} as Task

  // Mapear status do banco para o frontend
  const frontendStatus = dbToFrontendStatusMap[dbTask.status] || "todo"

  // Mapear prioridade do banco para o frontend
  const frontendPriority = dbToFrontendPriorityMap[dbTask.priority] || "medium"

  return {
    ...dbTask,
    status: frontendStatus,
    priority: frontendPriority,
    color: "#4b7bb5", // Cor padrão
    // Garantir que project_id seja preservado
    project_id: dbTask.project_id,
  }
}

/**
 * Mapeia uma tarefa do formato do frontend para o formato do banco
 */
function mapFrontendTaskToDb(frontendTask: any): any {
  if (!frontendTask) return {}

  // Filtrar campos virtuais que não existem no banco
  const { color, creator, assignee, ...dbTask } = frontendTask

  // Mapear status do frontend para o banco
  if (dbTask.status) {
    dbTask.status = frontendToDbStatusMap[dbTask.status] || dbTask.status
  }

  // Mapear prioridade do frontend para o banco
  if (dbTask.priority) {
    dbTask.priority = frontendToDbPriorityMap[dbTask.priority] || dbTask.priority
  }

  return dbTask
}

/**
 * Obtém estatísticas de tarefas
 */
export async function getTaskStats(projectId?: number): Promise<any> {
  try {
    const supabase = createClient()

    // Consulta para contar tarefas por status
    let query = supabase.from("tasks").select("status, count(*)")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    query = query.groupBy("status")

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar estatísticas de tarefas:", error)
      throw new Error(error.message)
    }

    // Formatar os dados para o frontend
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
    }

    data.forEach((item: any) => {
      const frontendStatus = dbToFrontendStatusMap[item.status] || item.status
      stats.byStatus[frontendStatus] = Number.parseInt(item.count)
      stats.total += Number.parseInt(item.count)
    })

    return stats
  } catch (error) {
    console.error("Erro ao buscar estatísticas de tarefas:", error)
    throw error
  }
}
