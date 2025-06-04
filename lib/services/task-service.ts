// =============================================================================
// 📁 lib/services/task-service.ts - SERVIÇO LIMPO E ROBUSTO
// =============================================================================

import { createClient } from "@/lib/supabase/server"
import type { DbTask, Task, CreateTaskInput, UpdateTaskInput, TaskFilters, TaskStatus } from "@/lib/types"

export class TaskService {
  private supabase = createClient()

  // Buscar tarefas com filtros
  async getTasks(filters: TaskFilters = {}): Promise<Task[]> {
    try {
      let query = this.supabase
        .from("tasks")
        .select("*")
        .order("order_position", { ascending: true })
        .order("created_at", { ascending: false })

      // Aplicar filtros de forma segura
      if (filters.project_id) {
        query = query.eq("project_id", filters.project_id)
      }

      if (filters.status?.length) {
        query = query.in("status", filters.status)
      }

      if (filters.priority?.length) {
        query = query.in("priority", filters.priority)
      }

      if (filters.assigned_to) {
        query = query.eq("assigned_to", filters.assigned_to)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.due_date_from) {
        query = query.gte("due_date", filters.due_date_from)
      }

      if (filters.due_date_to) {
        query = query.lte("due_date", filters.due_date_to)
      }

      // Paginação
      if (filters.limit) {
        const start = filters.offset || 0
        const end = start + filters.limit - 1
        query = query.range(start, end)
      }

      const { data, error } = await query

      if (error) {
        console.error("Erro ao buscar tarefas:", error)
        throw new Error(`Erro ao buscar tarefas: ${error.message}`)
      }

      return (data || []).map(this.enrichTask)
    } catch (error) {
      console.error("Erro no TaskService.getTasks:", error)
      throw error
    }
  }

  // Buscar tarefa por ID
  async getTaskById(id: number): Promise<Task> {
    try {
      const { data, error } = await this.supabase.from("tasks").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(`Tarefa com ID ${id} não encontrada`)
        }
        throw new Error(`Erro ao buscar tarefa: ${error.message}`)
      }

      return this.enrichTask(data as DbTask)
    } catch (error) {
      console.error(`Erro no TaskService.getTaskById(${id}):`, error)
      throw error
    }
  }

  // Criar nova tarefa
  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      // Validação
      if (!input.title?.trim()) {
        throw new Error("Título da tarefa é obrigatório")
      }

      // Dados limpos para inserção
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
        order_position: await this.getNextOrderPosition(input.project_id),
      }

      const { data, error } = await this.supabase.from("tasks").insert(taskData).select().single()

      if (error) {
        console.error("Erro ao criar tarefa:", error)
        throw new Error(`Erro ao criar tarefa: ${error.message}`)
      }

      return this.enrichTask(data as DbTask)
    } catch (error) {
      console.error("Erro no TaskService.createTask:", error)
      throw error
    }
  }

  // Atualizar tarefa
  async updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
    try {
      // Verificar se existe
      await this.getTaskById(id)

      // Dados limpos para atualização
      const updateData: Partial<DbTask> = {
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
      if (input.actual_hours !== undefined) updateData.actual_hours = input.actual_hours
      if (input.order_position !== undefined) updateData.order_position = input.order_position

      const { data, error } = await this.supabase.from("tasks").update(updateData).eq("id", id).select().single()

      if (error) {
        throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
      }

      return this.enrichTask(data as DbTask)
    } catch (error) {
      console.error(`Erro no TaskService.updateTask(${id}):`, error)
      throw error
    }
  }

  // Atualizar apenas status (otimizado para Kanban)
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    try {
      const { data, error } = await this.supabase
        .from("tasks")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(`Tarefa com ID ${id} não encontrada`)
        }
        throw new Error(`Erro ao atualizar status: ${error.message}`)
      }

      return this.enrichTask(data as DbTask)
    } catch (error) {
      console.error(`Erro no TaskService.updateTaskStatus(${id}, ${status}):`, error)
      throw error
    }
  }

  // Deletar tarefa
  async deleteTask(id: number): Promise<void> {
    try {
      const { error } = await this.supabase.from("tasks").delete().eq("id", id)

      if (error) {
        throw new Error(`Erro ao deletar tarefa: ${error.message}`)
      }
    } catch (error) {
      console.error(`Erro no TaskService.deleteTask(${id}):`, error)
      throw error
    }
  }

  // Reordenar tarefas (para Kanban)
  async reorderTasks(taskIds: number[], newStatus?: TaskStatus): Promise<void> {
    try {
      const updates = taskIds.map((id, index) => ({
        id,
        order_position: index,
        ...(newStatus && { status: newStatus }),
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        const { error } = await this.supabase
          .from("tasks")
          .update({
            order_position: update.order_position,
            ...(update.status && { status: update.status }),
            updated_at: update.updated_at,
          })
          .eq("id", update.id)

        if (error) {
          throw new Error(`Erro ao reordenar tarefa ${update.id}: ${error.message}`)
        }
      }
    } catch (error) {
      console.error("Erro no TaskService.reorderTasks:", error)
      throw error
    }
  }

  // Estatísticas de tarefas
  async getTaskStats(projectId?: number) {
    try {
      let query = this.supabase.from("tasks").select("status, priority")

      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
      }

      const tasks = data || []

      const stats = {
        total: tasks.length,
        byStatus: {} as Record<TaskStatus, number>,
        byPriority: {} as Record<string, number>,
      }

      tasks.forEach((task) => {
        // Count by status
        stats.byStatus[task.status as TaskStatus] = (stats.byStatus[task.status as TaskStatus] || 0) + 1

        // Count by priority
        stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error("Erro no TaskService.getTaskStats:", error)
      throw error
    }
  }

  // Métodos privados auxiliares
  private enrichTask(dbTask: DbTask): Task {
    const now = new Date()
    const dueDate = dbTask.due_date ? new Date(dbTask.due_date) : null

    return {
      ...dbTask,
      isOverdue: dueDate ? dueDate < now && dbTask.status !== "done" : false,
      statusLabel: this.getStatusLabel(dbTask.status),
      priorityLabel: this.getPriorityLabel(dbTask.priority),
    }
  }

  private getStatusLabel(status: TaskStatus): string {
    const labels = {
      backlog: "Backlog",
      todo: "A Fazer",
      in_progress: "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
    }
    return labels[status] || status
  }

  private getPriorityLabel(priority: string): string {
    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente",
    }
    return labels[priority as keyof typeof labels] || priority
  }

  private async getNextOrderPosition(projectId?: number | null): Promise<number> {
    try {
      let query = this.supabase
        .from("tasks")
        .select("order_position")
        .order("order_position", { ascending: false })
        .limit(1)

      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      const { data, error } = await query

      if (error) {
        console.warn("Erro ao buscar order_position, usando 0:", error)
        return 0
      }

      const tasks = data || []
      return tasks.length > 0 ? (tasks[0].order_position || 0) + 1 : 0
    } catch (error) {
      console.warn("Erro ao calcular order_position, usando 0:", error)
      return 0
    }
  }
}

// Instância singleton
export const taskService = new TaskService()
