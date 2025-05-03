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

    // Primeiro, buscar o projeto atual para ver quais campos ele tem
    const { data: currentProject, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (fetchError) {
      console.error("Erro ao buscar projeto atual:", fetchError)
      throw fetchError
    }

    // Criar um objeto com apenas os campos que existem no projeto atual
    const updateData = {}

    // Adicionar apenas os campos que existem no projeto atual e que foram enviados no body
    Object.keys(currentProject).forEach((key) => {
      if (body[key] !== undefined && key !== "id") {
        // Tratamento especial para campos numéricos
        if (key === "progress") {
          updateData[key] = body[key] === "" ? 0 : Number(body[key])
        } else {
          updateData[key] = body[key]
        }
      }
    })

    console.log("Campos existentes no projeto:", Object.keys(currentProject))
    console.log("Dados a serem atualizados:", updateData)

    // Atualizar o projeto
    const { data: project, error: updateError } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", projectId)
      .select()
      .single()

    if (updateError) {
      console.error("Erro ao atualizar projeto:", updateError)
      throw updateError
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

    // Buscar o projeto atualizado para retornar
    const { data: updatedProject, error: fetchUpdatedError } = await supabase
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
      .eq("id", projectId)
      .single()

    if (fetchUpdatedError) throw fetchUpdatedError

    return NextResponse.json(updatedProject)
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
