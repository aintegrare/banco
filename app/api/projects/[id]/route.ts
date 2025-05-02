import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    // Primeiro, tenta buscar por ID numérico
    if (!isNaN(Number(id))) {
      const { data: projectById, error: errorById } = await supabase
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
        .eq("id", id)
        .maybeSingle()

      if (!errorById && projectById) {
        return NextResponse.json(projectById)
      }
    }

    // Se não encontrou por ID ou o ID não é numérico, busca por slug
    // Primeiro, converte o slug para um formato que pode corresponder ao nome
    const possibleName = id.replace(/-/g, " ")

    // Busca projetos com nome similar - usando várias estratégias
    const { data: projectsByExactName, error: errorByExactName } = await supabase
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
      .ilike("name", possibleName)
      .maybeSingle()

    if (!errorByExactName && projectsByExactName) {
      return NextResponse.json(projectsByExactName)
    }

    // Tenta com correspondência parcial
    const { data: projectsByPartialName, error: errorByPartialName } = await supabase
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
      .ilike("name", `%${possibleName}%`)

    if (errorByPartialName) {
      console.error("Erro ao buscar por nome parcial:", errorByPartialName)
      return NextResponse.json({ error: "Erro ao buscar projeto" }, { status: 500 })
    }

    // Se não encontrou nenhum projeto
    if (!projectsByPartialName || projectsByPartialName.length === 0) {
      console.log(`Nenhum projeto encontrado com o nome similar a "${possibleName}"`)

      // Vamos listar todos os projetos para debug
      const { data: allProjects } = await supabase.from("projects").select("id, name").limit(10)

      console.log("Projetos disponíveis:", allProjects)

      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
    }

    // Se encontrou projetos, retorna o primeiro
    console.log(`Encontrados ${projectsByPartialName.length} projetos com nome similar a "${possibleName}"`)
    return NextResponse.json(projectsByPartialName[0])
  } catch (error) {
    console.error(`Erro ao buscar projeto ${params.id}:`, error)
    return NextResponse.json({ error: "Erro ao buscar projeto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id
    const body = await request.json()

    // Verificar se o ID é numérico
    let projectId = id
    if (isNaN(Number(id))) {
      // Se não for numérico, buscar o projeto pelo nome/slug
      const possibleName = id.replace(/-/g, " ")
      const { data: projectByName } = await supabase
        .from("projects")
        .select("id")
        .ilike("name", `%${possibleName}%`)
        .limit(1)
        .single()

      if (!projectByName) {
        return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
      }

      // Usar o ID numérico encontrado
      projectId = projectByName.id.toString()
    }

    // Abordagem simplificada: obter um projeto existente e usar suas propriedades
    console.log("Obtendo um projeto existente para determinar as colunas disponíveis...")
    const { data: sampleProject, error: sampleError } = await supabase.from("projects").select("*").limit(1).single()

    if (sampleError) {
      console.error("Erro ao obter projeto de exemplo:", sampleError)
      throw new Error("Não foi possível determinar as colunas da tabela projects")
    }

    // Usar as chaves do objeto como nomes de colunas
    const columnNames = Object.keys(sampleProject)
    console.log("Colunas disponíveis na tabela projects:", columnNames)

    // Criar um objeto com apenas as colunas que existem na tabela
    const updateData: Record<string, any> = {}

    // Adicionar apenas as colunas que existem
    if (columnNames.includes("name") && body.name) updateData.name = body.name
    if (columnNames.includes("description") && body.description !== undefined) updateData.description = body.description
    if (columnNames.includes("status") && body.status) updateData.status = body.status
    if (columnNames.includes("start_date") && body.start_date !== undefined) updateData.start_date = body.start_date
    if (columnNames.includes("end_date") && body.end_date !== undefined) updateData.end_date = body.end_date
    if (columnNames.includes("progress") && body.progress !== undefined) updateData.progress = body.progress
    if (columnNames.includes("color") && body.color) updateData.color = body.color

    // Adicionar client e budget apenas se existirem
    if (columnNames.includes("client") && body.client !== undefined) updateData.client = body.client
    if (columnNames.includes("budget") && body.budget !== undefined) updateData.budget = body.budget

    // Adicionar updated_at apenas se existir
    if (columnNames.includes("updated_at")) {
      updateData.updated_at = new Date().toISOString()
    }

    console.log("Dados a serem atualizados:", updateData)

    // Atualizar o projeto
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", projectId)
      .select()
      .single()

    if (projectError) {
      console.error("Erro ao atualizar projeto:", projectError)
      throw projectError
    }

    // Gerenciar membros do projeto
    if (body.members && project) {
      // Obter membros atuais
      const { data: currentMembers, error: membersQueryError } = await supabase
        .from("project_members")
        .select("id, user_id")
        .eq("project_id", projectId)

      if (membersQueryError) throw membersQueryError

      // Identificar membros a serem removidos
      const currentMemberIds = currentMembers?.map((m) => m.id) || []
      const newMemberIds = body.members.filter((m: any) => m.id > 0).map((m: any) => m.id)
      const membersToRemove = currentMemberIds.filter((id) => !newMemberIds.includes(id))

      // Remover membros que não estão mais na lista
      if (membersToRemove.length > 0) {
        const { error: removeError } = await supabase.from("project_members").delete().in("id", membersToRemove)

        if (removeError) throw removeError
      }

      // Atualizar membros existentes
      for (const member of body.members) {
        if (member.id > 0) {
          // Atualizar membro existente
          const { error: updateError } = await supabase
            .from("project_members")
            .update({ role: member.role })
            .eq("id", member.id)

          if (updateError) throw updateError
        } else {
          // Adicionar novo membro
          const { error: insertError } = await supabase.from("project_members").insert({
            project_id: Number(projectId),
            user_id: member.user_id,
            role: member.role,
          })

          if (insertError) throw insertError
        }
      }
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error(`Erro ao atualizar projeto ${params.id}:`, error)
    return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    // Verificar se o ID é numérico
    let projectId = id
    if (isNaN(Number(id))) {
      // Se não for numérico, buscar o projeto pelo nome/slug
      const possibleName = id.replace(/-/g, " ")
      const { data: projectByName } = await supabase
        .from("projects")
        .select("id")
        .ilike("name", `%${possibleName}%`)
        .limit(1)
        .single()

      if (!projectByName) {
        return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
      }

      // Usar o ID numérico encontrado
      projectId = projectByName.id.toString()
    }

    // Excluir o projeto (as relações serão excluídas automaticamente devido às restrições ON DELETE CASCADE)
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Erro ao excluir projeto ${params.id}:`, error)
    return NextResponse.json({ error: "Erro ao excluir projeto" }, { status: 500 })
  }
}
