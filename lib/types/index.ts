// =============================================================================
// 📁 lib/types/index.ts - TIPOS UNIFICADOS PARA O SISTEMA
// =============================================================================

// Constantes para status e prioridade
export const TASK_STATUS = {
  BACKLOG: "backlog",
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done",
} as const

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]

// Interface da tarefa no banco de dados
export interface DbTask {
  id: number
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  created_at: string
  updated_at: string
  estimated_hours?: number | null
  actual_hours?: number | null
  order_position?: number | null
}

// Interface da tarefa com campos computados
export interface Task extends DbTask {
  // Campos computados/virtuais
  isOverdue?: boolean
  statusLabel?: string
  priorityLabel?: string
}

// Input types para operações
export interface CreateTaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: Priority
  project_id?: number | null
  assigned_to?: number | null
  due_date?: string | null
  estimated_hours?: number | null
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  actual_hours?: number | null
  order_position?: number | null
}

// Filtros para busca
export interface TaskFilters {
  project_id?: number
  status?: TaskStatus[]
  priority?: Priority[]
  assigned_to?: number
  search?: string
  due_date_from?: string
  due_date_to?: string
  limit?: number
  offset?: number
}

// Tipos para projetos
export const PROJECT_STATUS = {
  PLANNING: "planning",
  PLANEJAMENTO: "planejamento",
  ACTIVE: "active",
  ATIVO: "ativo",
  ON_HOLD: "on_hold",
  PAUSADO: "pausado",
  COMPLETED: "completed",
  CONCLUIDO: "concluído",
  CANCELLED: "cancelled",
  CANCELADO: "cancelado",
} as const

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS]

export interface DbProject {
  id: number
  name: string
  description?: string | null
  status: string
  client_id?: number | null
  start_date?: string | null
  end_date?: string | null
  created_at: string
  updated_at: string
  progress?: number | null
  color?: string | null
}

export interface Project extends DbProject {
  // Campos computados/virtuais
  isOverdue?: boolean
  statusLabel?: string
}

export interface CreateProjectInput {
  name: string
  description?: string | null
  status?: string
  client_id?: number | null
  start_date?: string | null
  end_date?: string | null
  progress?: number | null
  color?: string | null
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface ProjectFilters {
  status?: string[]
  client_id?: number
  search?: string
  limit?: number
  offset?: number
}
