import type { D1Database, ExecutionContext } from "@cloudflare/workers-types"

export interface Env {
  D1_DATABASE: D1Database
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
