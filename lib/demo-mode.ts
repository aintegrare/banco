/**
 * Verifica se o sistema está rodando em modo de demonstração
 */
export function isDemoMode(): boolean {
  // Verificar no localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("demoMode") === "true"
  }
  return false
}

/**
 * Retorna dados simulados para o modo de demonstração
 * @param type Tipo de dados a serem simulados
 */
export function getDemoData(type: string): any {
  switch (type) {
    case "projects":
      return [
        { id: "demo-1", name: "Projeto Demo 1", status: "em_andamento", client: "Cliente Demo" },
        { id: "demo-2", name: "Projeto Demo 2", status: "concluido", client: "Cliente Demo" },
        { id: "demo-3", name: "Projeto Demo 3", status: "planejamento", client: "Cliente Demo" },
      ]
    case "tasks":
      return [
        { id: "task-1", title: "Tarefa Demo 1", status: "pendente", project_id: "demo-1" },
        { id: "task-2", title: "Tarefa Demo 2", status: "em_andamento", project_id: "demo-1" },
        { id: "task-3", title: "Tarefa Demo 3", status: "concluida", project_id: "demo-2" },
      ]
    case "clients":
      return [
        { id: "client-1", name: "Cliente Demo 1", email: "cliente1@demo.com" },
        { id: "client-2", name: "Cliente Demo 2", email: "cliente2@demo.com" },
      ]
    default:
      return []
  }
}

/**
 * Simula uma operação assíncrona para o modo de demonstração
 * @param operation Tipo de operação a ser simulada
 * @param data Dados para a operação
 */
export async function simulateDemoOperation(operation: string, data?: any): Promise<any> {
  // Simular um atraso para parecer uma operação real
  await new Promise((resolve) => setTimeout(resolve, 800))

  switch (operation) {
    case "create":
      return { id: `demo-${Date.now()}`, ...data }
    case "update":
      return { ...data, updated_at: new Date().toISOString() }
    case "delete":
      return { success: true }
    default:
      return { success: true }
  }
}
