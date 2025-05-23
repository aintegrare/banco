import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { projectIds } = body

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Lista de IDs de projetos inválida",
        },
        { status: 400 },
      )
    }

    // Verificar se a coluna order_position existe na tabela projects
    const { data: tableInfo, error: tableError } = await supabase.from("projects").select("*").limit(1)

    if (tableError) {
      console.error("Erro ao verificar estrutura da tabela:", tableError)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao verificar estrutura da tabela",
        },
        { status: 500 },
      )
    }

    // Se a coluna order_position não existir, criá-la
    const sampleProject = tableInfo?.[0] || {}
    if (!("order_position" in sampleProject)) {
      try {
        // Adicionar coluna order_position
        await supabase.rpc("add_column_if_not_exists", {
          table_name: "projects",
          column_name: "order_position",
          column_type: "integer",
        })

        console.log("Coluna order_position adicionada à tabela projects")
      } catch (error) {
        console.error("Erro ao adicionar coluna order_position:", error)

        // Tentar adicionar a coluna diretamente com SQL
        const { error: sqlError } = await supabase.rpc("execute_sql", {
          sql: "ALTER TABLE projects ADD COLUMN IF NOT EXISTS order_position INTEGER DEFAULT 0",
        })

        if (sqlError) {
          console.error("Erro ao adicionar coluna com SQL:", sqlError)
          return NextResponse.json(
            {
              success: false,
              error: "Não foi possível adicionar a coluna order_position",
            },
            { status: 500 },
          )
        }
      }
    }

    // Atualizar a ordem dos projetos
    for (let i = 0; i < projectIds.length; i++) {
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          order_position: i,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectIds[i])

      if (updateError) {
        console.error(`Erro ao atualizar ordem do projeto ${projectIds[i]}:`, updateError)
        return NextResponse.json(
          {
            success: false,
            error: `Erro ao atualizar ordem do projeto ${projectIds[i]}`,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao reordenar projetos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao reordenar projetos",
      },
      { status: 500 },
    )
  }
}
