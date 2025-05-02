import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // SQL para criar a função get_table_columns
    const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
    RETURNS TABLE (
      column_name text,
      data_type text,
      is_nullable boolean
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        c.column_name::text,
        c.data_type::text,
        (c.is_nullable = 'YES')::boolean
      FROM 
        information_schema.columns c
      WHERE 
        c.table_schema = 'public' AND
        c.table_name = table_name;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    // Executar o SQL
    const { data, error } = await supabase.rpc("get_table_columns", { table_name: "projects" })

    if (error) {
      // Se a função não existe, vamos criá-la
      console.log("Função get_table_columns não encontrada, criando agora...")
      const { error: createError } = await supabase.rpc("exec_sql", { sql: createFunctionSQL })

      if (createError) {
        // Se não podemos usar o exec_sql, tentamos uma abordagem direta
        console.log("Tentativa alternativa de criar função...")
        const { error: rawError } = await supabase.from("_temp_executions").insert({ sql: createFunctionSQL })

        if (rawError) {
          throw new Error(
            "Não foi possível criar a função. Por favor, execute o SQL manualmente no console do Supabase.",
          )
        }
      }

      // Verificar se a função foi criada
      const { data: verifyData, error: verifyError } = await supabase.rpc("get_table_columns", {
        table_name: "projects",
      })
      if (verifyError) {
        throw new Error(`Função get_table_columns não foi criada corretamente: ${verifyError.message}`)
      }

      return NextResponse.json({
        message: "Função get_table_columns criada com sucesso!",
        status: "success",
      })
    }

    // A função já existe
    return NextResponse.json({
      message: "Função get_table_columns já existe!",
      data: data,
      status: "success",
    })
  } catch (error: any) {
    console.error("Erro ao configurar funções SQL:", error)
    return NextResponse.json(
      {
        message: `Erro ao configurar funções SQL: ${error.message}`,
        error: error.message,
        status: "error",
      },
      { status: 500 },
    )
  }
}
