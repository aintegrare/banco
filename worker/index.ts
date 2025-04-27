export interface Env {
  D1_DATABASE: D1Database
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Esta é uma API simples para verificar se o Worker está funcionando
    // e se a conexão com o banco de dados está correta

    try {
      // Verificar a conexão com o banco de dados
      const { results } = await env.D1_DATABASE.prepare("SELECT 1 as test").all()

      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Cloudflare Worker está funcionando corretamente",
          database: "Conexão com D1 estabelecida com sucesso",
          test: results,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Erro ao conectar com o banco de dados",
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  },
}

// Adicionar a definição do tipo D1Database para evitar erros de tipo
interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>
  exec(query: string): Promise<D1ExecResult>
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T>
  run<T = unknown>(): Promise<T>
  all<T = unknown>(): Promise<D1Result<T>>
}

interface D1Result<T = unknown> {
  results?: T[]
  success: boolean
  error?: string
  meta?: object
}

interface D1ExecResult {
  count: number
  duration: number
}
