// Interface para o ambiente global
declare global {
  var __d1Database: any
  namespace NodeJS {
    interface ProcessEnv {
      D1_DATABASE?: any
    }
  }
}

// Função para obter a instância do D1Database
export function getD1Database(): any {
  try {
    if (process.env.D1_DATABASE) {
      return process.env.D1_DATABASE
    }

    if (global.__d1Database) {
      return global.__d1Database
    }

    // Se estamos em desenvolvimento e não temos D1, criar um mock
    if (process.env.NODE_ENV === "development") {
      console.log("Ambiente de desenvolvimento detectado, usando mock do D1")
      return createMockD1Database()
    }

    console.warn("D1_DATABASE não encontrado, retornando null")
    return null
  } catch (error) {
    console.error("Erro ao obter D1Database:", error)
    return null
  }
}

// Função para criar um mock do D1Database para desenvolvimento
function createMockD1Database() {
  return {
    prepare: () => {
      return {
        bind: (...args: any[]) => ({
          first: async () => ({ total: 0 }),
          all: async () => ({ results: [] }),
          run: async () => ({}),
        }),
        first: async () => ({ total: 0 }),
        all: async () => ({ results: [] }),
        run: async () => ({}),
      }
    },
    batch: async (queries: any[]) => [],
    exec: async (query: string) => ({ results: [] }),
  }
}

// Função para verificar se o D1 está disponível
export async function isD1Available(): Promise<boolean> {
  const db = getD1Database()
  if (!db) return false

  try {
    await db.prepare("SELECT 1").first()
    return true
  } catch (error) {
    console.error("Erro ao verificar disponibilidade do D1:", error)
    return false
  }
}
