import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // 1. Tentar obter a definição da tabela tasks
    let tableDefinition = null
    try {
      const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_definition", { table_name: "tasks" })
      if (!tableError && tableInfo) {
        tableDefinition = tableInfo
      } else {
        console.error("Erro ao obter definição da tabela tasks:", tableError)
      }
    } catch (err) {
      console.error("Exceção ao obter definição da tabela tasks:", err)
    }

    // 2. Tentar obter as colunas da tabela tasks
    let columns = null
    try {
      const { data: columnsData, error: columnsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", "tasks")

      if (!columnsError && columnsData) {
        columns = columnsData
      } else {
        console.error("Erro ao obter colunas da tabela tasks:", columnsError)
      }
    } catch (err) {
      console.error("Exceção ao obter colunas da tabela tasks:", err)
    }

    // 3. Tentar obter restrições da tabela tasks
    let constraints = null
    try {
      const { data: constraintsData, error: constraintsError } = await supabase
        .from("information_schema.table_constraints")
        .select("constraint_name, constraint_type")
        .eq("table_name", "tasks")

      if (!constraintsError && constraintsData) {
        constraints = constraintsData
      } else {
        console.error("Erro ao obter restrições da tabela tasks:", constraintsError)
      }
    } catch (err) {
      console.error("Exceção ao obter restrições da tabela tasks:", err)
    }

    // 4. Tentar criar uma tarefa básica para ver o erro
    let createResult = null
    try {
      const { data: insertData, error: insertError } = await supabase
        .from("tasks")
        .insert({
          title: "Tarefa de teste",
          project_id: "1",
          created_at: new Date().toISOString(),
        })
        .select()

      createResult = {
        success: !insertError,
        data: insertData,
        error: insertError ? insertError.message : null,
      }
    } catch (err) {
      console.error("Exceção ao criar tarefa de teste:", err)
      createResult = {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }

    // Reunir todas as informações
    const debugInfo = {
      tableDefinition,
      columns,
      constraints,
      createTaskResult: createResult,
    }

    return NextResponse.json(debugInfo)
  } catch (error: any) {
    console.error("Erro ao depurar tabela tasks:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
