// =============================================================================
// 📁 lib/utils/task-validation.ts - UTILITÁRIOS DE VALIDAÇÃO
// =============================================================================

import type { Task, TaskStatus, Priority } from "@/lib/types"

export interface TaskValidationResult {
  isValid: boolean
  error?: string
  taskId?: number
}

/**
 * Valida um ID de tarefa, rejeitando IDs de exemplo
 */
export function validateTaskId(id: any): TaskValidationResult {
  // Verificar se existe
  if (id === undefined || id === null) {
    return { isValid: false, error: "ID não fornecido" }
  }

  const stringId = String(id).trim()

  // Rejeitar IDs de exemplo
  if (stringId.startsWith("example-") || stringId.includes("example")) {
    return {
      isValid: false,
      error: `ID de exemplo não permitido: "${stringId}". Use apenas IDs de tarefas reais.`,
    }
  }

  // Verificar se é numérico
  const numericId = Number.parseInt(stringId, 10)

  if (isNaN(numericId) || numericId <= 0) {
    return {
      isValid: false,
      error: `ID inválido: "${stringId}". Deve ser um número positivo.`,
    }
  }

  return { isValid: true, taskId: numericId }
}

/**
 * Valida uma tarefa completa
 */
export function validateTask(task: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validar ID
  const idValidation = validateTaskId(task?.id)
  if (!idValidation.isValid) {
    errors.push(idValidation.error || "ID inválido")
  }

  // Validar título
  if (!task?.title || typeof task.title !== "string" || !task.title.trim()) {
    errors.push("Título é obrigatório")
  }

  // Validar status
  const validStatuses: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"]
  if (task?.status && !validStatuses.includes(task.status)) {
    errors.push(`Status inválido: "${task.status}". Deve ser um dos: ${validStatuses.join(", ")}`)
  }

  // Validar prioridade
  const validPriorities: Priority[] = ["low", "medium", "high", "urgent"]
  if (task?.priority && !validPriorities.includes(task.priority)) {
    errors.push(`Prioridade inválida: "${task.priority}". Deve ser uma das: ${validPriorities.join(", ")}`)
  }

  return { isValid: errors.length === 0, errors }
}

/**
 * Filtra apenas tarefas reais, removendo dados de exemplo
 */
export function filterRealTasks(tasks: any[]): Task[] {
  return tasks.filter((task) => {
    const validation = validateTaskId(task?.id)
    if (!validation.isValid) {
      console.warn("Tarefa com ID inválido removida:", task, validation.error)
    }
    return validation.isValid
  }) as Task[]
}
