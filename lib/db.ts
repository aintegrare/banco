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
  if (process.env.D1_DATABASE) {
    return process.env.D1_DATABASE
  }

  if (global.__d1Database) {
    return global.__d1Database
  }

  return null
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
