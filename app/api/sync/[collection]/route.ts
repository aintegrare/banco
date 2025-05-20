import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { collection: string } }) {
  try {
    const { collection } = params
    const { changes } = await request.json()

    if (!changes || !Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json({ error: "Nenhuma alteração para sincronizar" }, { status: 400 })
    }

    // Validar coleção
    const validCollections = ["posts", "projects", "tasks", "clients"]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: "Coleção inválida" }, { status: 400 })
    }

    // Criar cliente Supabase
    const supabase = createClient()

    // Processar alterações
    const results = []
    for (const change of changes) {
      const { id, operation, data, timestamp } = change

      // Validar operação
      if (!["create", "update", "delete"].includes(operation)) {
        results.push({
          id,
          success: false,
          error: "Operação inválida",
        })
        continue
      }

      try {
        let result

        switch (operation) {
          case "create":
          case "update":
            // Inserir ou atualizar
            result = await supabase.from(collection).upsert({ ...data, last_synced: timestamp })

            results.push({
              id,
              success: !result.error,
              error: result.error?.message,
            })
            break

          case "delete":
            // Excluir
            result = await supabase.from(collection).delete().eq("id", id)

            results.push({
              id,
              success: !result.error,
              error: result.error?.message,
            })
            break
        }
      } catch (error) {
        results.push({
          id,
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Erro ao sincronizar:", error)
    return NextResponse.json({ error: "Erro ao processar sincronização" }, { status: 500 })
  }
}
