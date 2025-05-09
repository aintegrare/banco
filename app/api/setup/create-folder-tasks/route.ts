import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Verificar se a extensão uuid-ossp está instalada
    const { error: extensionError } = await supabase.rpc("execute_sql", {
      sql_statement: `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `,
    })

    if (extensionError) {
      console.error("Erro ao criar extensão uuid-ossp:", extensionError)
      return NextResponse.json({ error: extensionError.message }, { status: 500 })
    }

    // Criar a tabela folder_tasks se não existir
    const { error: tableError } = await supabase.rpc("execute_sql", {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS public.folder_tasks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          folder_path TEXT NOT NULL,
          description TEXT,
          is_completed BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          due_date TIMESTAMP WITH TIME ZONE,
          color VARCHAR(20),
          comments TEXT
        );
        
        -- Criar índice para melhorar performance
        CREATE INDEX IF NOT EXISTS folder_tasks_folder_path_idx ON public.folder_tasks (folder_path);
      `,
    })

    if (tableError) {
      console.error("Erro ao criar tabela folder_tasks:", tableError)
      return NextResponse.json({ error: tableError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Tabela folder_tasks criada com sucesso" })
  } catch (error: any) {
    console.error("Erro ao criar tabela folder_tasks:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
