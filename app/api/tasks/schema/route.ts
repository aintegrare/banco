import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Consulta para obter informações sobre a tabela tasks
    const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
      table_name: "tasks",
    })

    if (columnsError) {
      console.error("Erro ao obter colunas da tabela tasks:", columnsError)

      // Tentar uma abordagem alternativa
      const { data: tableInfo, error: tableError } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .limit(0)

      if (tableError) {
        return NextResponse.json({ error: "Não foi possível obter informações da tabela" }, { status: 500 })
      }

      return NextResponse.json({
        message: "Informações básicas da tabela",
        exists: true,
        columns: Object.keys(tableInfo || {}),
      })
    }

    return NextResponse.json({
      columns,
      message: "Informações detalhadas da tabela",
    })
  } catch (error: any) {
    console.error("Erro ao processar requisição de esquema:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
