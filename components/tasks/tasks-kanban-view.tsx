"use client"
import { CompleteKanbanSystem } from "./complete-kanban-system"

interface Task {
  id: number
  title: string
  description?: string | null
  status: "backlog" | "todo" | "in_progress" | "review" | "done"
  priority?: "high" | "medium" | "low" | null
  project_id?: number | null
  due_date?: string | null
  color?: string | null
  assignee?: string | null
}

interface Project {
  id: string | number
  name: string
}

interface TasksKanbanViewProps {
  projectId?: number
  onTaskUpdate?: (task: any) => void
}

export function TasksKanbanView({ projectId, onTaskUpdate }: TasksKanbanViewProps) {
  // Este componente agora é apenas um wrapper para o CompleteKanbanSystem
  // para manter compatibilidade com código existente
  return <CompleteKanbanSystem projectId={projectId} />
}
