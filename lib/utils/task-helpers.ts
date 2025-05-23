// Função para debug de IDs de tarefa
export function debugTaskId(id: any, context = ""): void {
  console.log(`[DEBUG${context ? ` - ${context}` : ""}] Task ID:`, {
    original: id,
    type: typeof id,
    string: String(id),
    number: Number(id),
    parseInt: Number.parseInt(String(id), 10),
    isNaN: isNaN(Number(id)),
    isValid: !isNaN(Number.parseInt(String(id), 10)) && Number.parseInt(String(id), 10) > 0,
  })
}

// Função para validar ID de tarefa
export function validateTaskId(id: any): number {
  const stringId = String(id).trim()
  const numericId = Number.parseInt(stringId, 10)

  if (isNaN(numericId) || numericId <= 0) {
    throw new Error(`ID de tarefa inválido: "${id}" (tipo: ${typeof id})`)
  }

  return numericId
}

// Função para normalizar tarefas vindas da API
export function normalizeTasks(tasks: any[]): any[] {
  return tasks.map((task) => ({
    ...task,
    id: validateTaskId(task.id),
  }))
}

// Função para extrair e validar ID de parâmetros de rota
export function extractRouteId(idParam: string): number {
  const cleanId = idParam.trim()
  const numericId = Number.parseInt(cleanId, 10)

  if (isNaN(numericId) || numericId <= 0) {
    throw new Error(`ID inválido: "${idParam}". Deve ser um número positivo.`)
  }

  return numericId
}
