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

    // Criar objeto com dados do projeto
    const projectData: Record<string, any> = {
      name,
      description: description || null,
      status: status || "planning", // Valor padrão
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Adicionar campos opcionais apenas se fornecidos
    if (start_date) projectData.start_date = start_date
    if (end_date) projectData.end_date = end_date
    if (progress !== undefined) projectData.progress = progress || 0
    if (color) projectData.color = color || "#4b7bb5"

    console.log("Dados do projeto a serem inseridos:", projectData)

    // Inserir o projeto
    const { data: project, error } = await supabase.from("projects").insert(projectData).select().single()

    if (error) {
      console.error("Erro detalhado ao criar projeto:", error)
      throw error
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Erro ao criar projeto:", error)
    return NextResponse.json({ error: "Erro ao criar projeto", details: error.message }, { status: 500 })
  }
}
