import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Obter informações sobre a tabela projects usando a função RPC
    const { data: columnsInfo, error: columnsError } = await supabase.rpc("get_table_columns", {
      table_name: "projects",
    })

    if (columnsError) {
      console.error("Erro ao obter colunas da tabela:", columnsError)

      // Plano B: Obter um projeto existente e usar suas chaves como colunas
      const { data: projectsInfo, error: projectsError } = await supabase.from("projects").select("*").limit(1)

      if (projectsError) {
        console.error("Erro ao obter exemplo de projeto:", projectsError)
        return NextResponse.json({ error: "Erro ao obter esquema" }, { status: 500 })
      }

      // Extrair nomes das colunas do primeiro projeto
      const columns = projectsInfo && projectsInfo.length > 0 ? Object.keys(projectsInfo[0]) : []

      return NextResponse.json({
        table: "projects",
        columns,
        sample: projectsInfo && projectsInfo.length > 0 ? projectsInfo[0] : null,
      })
    }

    // Extrair nomes das colunas
    const columns = columnsInfo ? columnsInfo.map((col: any) => col.column_name) : []

    // Obter um exemplo de projeto para referência
    const { data: projectsInfo, error: projectsError } = await supabase.from("projects").select("*").limit(1)

    if (projectsError) {
      console.error("Erro ao obter exemplo de projeto:", projectsError)
    }

    return NextResponse.json({
      table: "projects",
      columns,
      columnDetails: columnsInfo,
      sample: projectsInfo && projectsInfo.length > 0 ? projectsInfo[0] : null,
    })
  } catch (error) {
    console.error("Erro ao obter esquema:", error)
    return NextResponse.json({ error: "Erro ao obter esquema" }, { status: 500 })
  }
}
