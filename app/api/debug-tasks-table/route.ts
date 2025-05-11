import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const debugInfo: any = {}

    // 1. Tentar obter uma tarefa existente para ver sua estrutura
    const { data: existingTasks, error: tasksError } = await supabase.from("tasks").select("*").limit(1)

    if (tasksError) {
      debugInfo.tasksError = tasksError.message
    } else {
      debugInfo.sampleTask = existingTasks && existingTasks.length > 0 ? existingTasks[0] : null
    }

    // 2. Tentar obter informações sobre a tabela tasks
    try {
      const { data: tableInfo, error: tableInfoError } = await supabase
        .rpc("get_table_info", { table_name: "tasks" })
        .select()

      if (tableInfoError) {
        debugInfo.tableInfoError = tableInfoError.message
      } else {
        debugInfo.tableInfo = tableInfo
      }
    } catch (e: any) {
      debugInfo.tableInfoException = e.message
    }

    // 3. Tentar obter a definição da tabela tasks
    try {
      const { data: tableDefinition, error: tableDefError } = await supabase
        .rpc("get_table_definition", { table_name: "tasks" })
        .select()

      if (tableDefError) {
        debugInfo.tableDefError = tableDefError.message
      } else {
        debugInfo.tableDefinition = tableDefinition
      }
    } catch (e: any) {
      debugInfo.tableDefException = e.message
    }

    // 4. Tentar obter informações sobre as colunas da tabela tasks
    const { data: columnsInfo, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "tasks")

    if (columnsError) {
      debugInfo.columnsError = columnsError.message
    } else {
      debugInfo.columns = columnsInfo
    }

    // 5. Tentar obter informações sobre as restrições da tabela tasks
    try {
      const { data: constraintsData, error: constraintsError } = await supabase.query(`
        SELECT con.conname AS constraint_name,
               con.contype AS constraint_type,
               pg_get_constraintdef(con.oid) AS constraint_definition
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE rel.relname = 'tasks'
      `)

      if (constraintsError) {
        debugInfo.constraintsError = constraintsError.message
      } else {
        debugInfo.constraints = constraintsData
      }
    } catch (e: any) {
      debugInfo.constraintsException = e.message
    }

    // 6. Verificar se a função get_table_info existe
    try {
      const { data: functionExists, error: functionError } = await supabase.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM pg_proc 
          WHERE proname = 'get_table_info'
        ) AS function_exists
      `)

      if (functionError) {
        debugInfo.functionCheckError = functionError.message
      } else {
        debugInfo.functionExists = functionExists
      }
    } catch (e: any) {
      debugInfo.functionCheckException = e.message
    }

    return NextResponse.json(debugInfo)
  } catch (error: any) {
    console.error("Erro ao obter informações de depuração:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
