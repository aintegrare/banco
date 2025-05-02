import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase
      .from("projects")
      .select(`
        *,
        members:project_members(
          id,
          user_id,
          role,
          user:users(id, name, email, role)
        )
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Erro ao listar projetos:", error)
    return NextResponse.json({ error: "Erro ao listar projetos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { name, description, status, start_date, end_date, progress, color } = body

    // Validar dados obrigatórios
    if (!name) {
      return NextResponse.json({ error: "Nome do projeto é obrigatório" }, { status: 400 })
    }

    // Verificar quais colunas existem na tabela projects
    const { data: tableInfo, error: tableError } = await supabase.from("projects").select("*").limit(1)

    if (tableError) {
      console.error("Erro ao verificar estrutura da tabela:", tableError)
    }

    // Criar objeto com apenas as colunas que existem
    const projectData: Record<string, any> = {
      name,
      description,
      status: status || "em_andamento",
      created_at: new Date().toISOString(),
    }

    // Adicionar colunas opcionais apenas se existirem na tabela
    if (tableInfo && tableInfo.length > 0) {
      const sampleProject = tableInfo[0]

      if ("start_date" in sampleProject) projectData.start_date = start_date
      if ("end_date" in sampleProject) projectData.end_date = end_date
      if ("progress" in sampleProject) projectData.progress = progress || 0
      if ("color" in sampleProject) projectData.color = color || "#4b7bb5"
    }

    console.log("Dados do projeto a serem inseridos:", projectData)

    // Inserir o projeto
    const { data: project, error } = await supabase.from("projects").insert(projectData).select().single()

    if (error) throw error

    return NextResponse.json(project)
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 })
  }
}
