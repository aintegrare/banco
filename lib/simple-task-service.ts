import { createClient } from "@/lib/supabase/server"

// Interface básica da tarefa
export interface SimpleTask {
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
  order_position?: number | null
}

// Filtros básicos
export interface SimpleTaskFilters {
  project_id?: number
  status?: string
  priority?: string
  search?: string
  limit?: number
  offset?: number
}

// Input para criação
export interface SimpleCreateTaskInput {
  title: string
  description?: string | null
  status?: string
  priority?: string
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  estimated_hours?: number | null
}

// =============================================================================
// FUNÇÕES SIMPLES (SEM CLASSE)
// =============================================================================

/**
 * Buscar todas as tarefas
 */
export async function getSimpleTasks(filters: SimpleTaskFilters = {}): Promise<SimpleTask[]> {
  try {
    console.log("🔄 getSimpleTasks iniciado com filtros:", filters)

    const supabase = createClient()
    let query = supabase.from("tasks").select("*").order("created_at", { ascending: false })

    // Aplicar filtros simples
    if (filters.project_id) {
      console.log(`📁 Filtrando por projeto: ${filters.project_id}`)
      query = query.eq("project_id", filters.project_id)
    }

    if (filters.status) {
      console.log(`📊 Filtrando por status: ${filters.status}`)
      query = query.eq("status", filters.status)
    }

    if (filters.priority) {
      console.log(`⚡ Filtrando por prioridade: ${filters.priority}`)
      query = query.eq("priority", filters.priority)
    }

    if (filters.search) {
      console.log(`🔍 Pesquisando por: ${filters.search}`)
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.limit) {
      const start = filters.offset || 0
      const end = start + filters.limit - 1
      query = query.range(start, end)
    }

    console.log("📡 Executando query no Supabase...")
    const { data, error } = await query

    if (error) {
      console.error("❌ Erro no Supabase:", error)
      throw new Error(`Erro ao buscar tarefas: ${error.message}`)
    }

    if (!data) {
      console.log("⚠️  Nenhuma tarefa encontrada")
      return []
    }

    console.log(`✅ ${data.length} tarefas encontradas`)

    // Retornar dados simples, sem enriquecimento
    return data.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assigned_to: task.assigned_to,
      due_date: task.due_date,
      created_at: task.created_at,
      updated_at: task.updated_at,
      estimated_hours: task.estimated_hours,
      actual_hours: task.actual_hours,
      order_position: task.order_position,
    }))
  } catch (error) {
    console.error("❌ Erro em getSimpleTasks:", error)
    throw error
  }
}

/**
 * Buscar tarefa por ID
 */
export async function getSimpleTaskById(id: number): Promise<SimpleTask> {
  try {
    console.log(`🔄 getSimpleTaskById iniciado para ID: ${id}`)

    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

    if (error) {
      console.error(`❌ Erro no Supabase:`, error)
      if (error.code === "PGRST116") {
        throw new Error(`Tarefa com ID ${id} não encontrada`)
      }
      throw new Error(`Erro ao buscar tarefa: ${error.message}`)
    }

    console.log(`✅ Tarefa ${id} encontrada`)
    return data
  } catch (error) {
    console.error(`❌ Erro em getSimpleTaskById(${id}):`, error)
    throw error
  }
}

/**
 * Criar nova tarefa
 */
export async function createSimpleTask(input: SimpleCreateTaskInput): Promise<SimpleTask> {
  try {
    console.log("🔄 createSimpleTask iniciado:", input.title)

    if (!input.title?.trim()) {
      throw new Error("Título da tarefa é obrigatório")
    }

    const taskData = {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status || "todo",
      priority: input.priority || "medium",
      project_id: input.project_id || null,
      assigned_to: input.assigned_to || null,
      due_date: input.due_date || null,
      estimated_hours: input.estimated_hours || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_position: 0,
    }

    console.log("📝 Dados para inserção:", taskData)

    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").insert(taskData).select().single()

    if (error) {
      console.error("❌ Erro no Supabase:", error)
      throw new Error(`Erro ao criar tarefa: ${error.message}`)
    }

    console.log(`✅ Tarefa criada com ID: ${data.id}`)
    return data
  } catch (error) {
    console.error("❌ Erro em createSimpleTask:", error)
    throw error
  }
}

/**
 * Atualizar status da tarefa
 */
export async function updateSimpleTaskStatus(id: number, status: string): Promise<SimpleTask> {
  try {
    console.log(`🔄 updateSimpleTaskStatus: ${id} → ${status}`)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro no Supabase:`, error)
      if (error.code === "PGRST116") {
        throw new Error(`Tarefa com ID ${id} não encontrada`)
      }
      throw new Error(`Erro ao atualizar status: ${error.message}`)
    }

    console.log(`✅ Status da tarefa ${id} atualizado`)
    return data
  } catch (error) {
    console.error(`❌ Erro em updateSimpleTaskStatus(${id}, ${status}):`, error)
    throw error
  }
}

/**
 * Atualizar tarefa completa
 */
export async function updateSimpleTask(id: number, input: Partial<SimpleCreateTaskInput>): Promise<SimpleTask> {
  try {
    console.log(`🔄 updateSimpleTask iniciado para ID: ${id}`)

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (input.title !== undefined) updateData.title = input.title.trim()
    if (input.description !== undefined) updateData.description = input.description?.trim() || null
    if (input.status !== undefined) updateData.status = input.status
    if (input.priority !== undefined) updateData.priority = input.priority
    if (input.project_id !== undefined) updateData.project_id = input.project_id
    if (input.assigned_to !== undefined) updateData.assigned_to = input.assigned_to
    if (input.due_date !== undefined) updateData.due_date = input.due_date
    if (input.estimated_hours !== undefined) updateData.estimated_hours = input.estimated_hours

    console.log("📝 Dados para atualização:", updateData)

    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error(`❌ Erro no Supabase:`, error)
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
    }

    console.log(`✅ Tarefa ${id} atualizada`)
    return data
  } catch (error) {
    console.error(`❌ Erro em updateSimpleTask(${id}):`, error)
    throw error
  }
}

/**
 * Deletar tarefa
 */
export async function deleteSimpleTask(id: number): Promise<void> {
  try {
    console.log(`🔄 deleteSimpleTask iniciado para ID: ${id}`)

    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error(`❌ Erro no Supabase:`, error)
      throw new Error(`Erro ao deletar tarefa: ${error.message}`)
    }

    console.log(`✅ Tarefa ${id} deletada`)
  } catch (error) {
    console.error(`❌ Erro em deleteSimpleTask(${id}):`, error)
    throw error
  }
}
