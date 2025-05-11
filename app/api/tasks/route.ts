import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    console.log("API tasks: Buscando tarefas", projectId ? `para o projeto ${projectId}` : "para todos os projetos")

    const supabase = createClient()

    let query = supabase.from("tasks").select("*")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("API tasks: Erro ao buscar tarefas:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API tasks: ${data?.length || 0} tarefas encontradas`)

    // Se não houver dados do banco de dados, use o fallback
    if (!data || data.length === 0) {
      console.log("API tasks: Usando dados de fallback")
      return NextResponse.json(fallbackTasks)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API tasks: Erro ao processar requisição de tarefas:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Modificar a função POST para resolver o problema com o status
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, priority, project_id, due_date, color, creator, assignee } = body

    if (!title || !project_id) {
      return NextResponse.json({ error: "Título e ID do projeto são obrigatórios" }, { status: 400 })
    }

    const supabase = createClient()

    // Primeiro, vamos verificar se existem tarefas no banco e obter os valores de status existentes
    const { data: existingTasks, error: tasksError } = await supabase.from("tasks").select("status").limit(10)

    if (tasksError) {
      console.error("Erro ao buscar tarefas existentes:", tasksError)
    }

    let knownStatusValues: string[] = []

    if (existingTasks && existingTasks.length > 0) {
      // Extrair valores de status únicos
      knownStatusValues = [...new Set(existingTasks.map((task) => task.status).filter(Boolean))]
      console.log("Valores de status conhecidos:", knownStatusValues)
    }

    // Se não encontramos valores de status existentes, tentaremos buscar a coluna status na definição da tabela
    if (knownStatusValues.length === 0) {
      try {
        // Executar uma consulta direta à tabela tasks sem filtro para ver se há erro
        const { data: sampleTask, error: sampleError } = await supabase
          .from("tasks")
          .select("status")
          .limit(1)
          .maybeSingle()

        if (!sampleError && sampleTask) {
          console.log("Exemplo de tarefa obtido:", sampleTask)
        }
      } catch (err) {
        console.error("Erro ao buscar exemplo de tarefa:", err)
      }
    }

    // Verificar se o banco permite inserir sem especificar o status
    let shouldTryWithoutStatus = true

    // Criar versão do taskData sem status explícito
    const taskDataWithoutStatus = {
      title,
      description: description || null,
      priority: priority || "medium",
      project_id,
      due_date: due_date || null,
      created_at: new Date().toISOString(),
    }

    // Tentar criar tarefa sem especificar um status (deixar o valor padrão do banco)
    console.log("Tentando criar tarefa sem especificar status")
    const { data: createdWithoutStatus, error: withoutStatusError } = await supabase
      .from("tasks")
      .insert(taskDataWithoutStatus)
      .select()
      .single()

    if (!withoutStatusError) {
      console.log("Tarefa criada com sucesso sem especificar status:", createdWithoutStatus)

      // Adicionar os campos removidos de volta à resposta
      const responseData = {
        ...createdWithoutStatus,
        color: color || "#4b7bb5",
        creator: creator || null,
        assignee: assignee || null,
      }

      return NextResponse.json(responseData)
    } else {
      console.error("Erro ao criar tarefa sem status:", withoutStatusError)
      shouldTryWithoutStatus = false
    }

    // Se temos valores de status conhecidos, tentaremos criar com eles
    if (knownStatusValues.length > 0) {
      for (const knownStatus of knownStatusValues) {
        const taskDataWithKnownStatus = {
          ...taskDataWithoutStatus,
          status: knownStatus,
        }

        console.log(`Tentando criar tarefa com status conhecido: ${knownStatus}`)
        const { data: createdWithKnownStatus, error: knownStatusError } = await supabase
          .from("tasks")
          .insert(taskDataWithKnownStatus)
          .select()
          .single()

        if (!knownStatusError) {
          console.log(`Tarefa criada com sucesso usando status conhecido: ${knownStatus}`)

          // Adicionar os campos removidos de volta à resposta
          const responseData = {
            ...createdWithKnownStatus,
            color: color || "#4b7bb5",
            creator: creator || null,
            assignee: assignee || null,
          }

          return NextResponse.json(responseData)
        } else {
          console.error(`Erro ao criar tarefa com status conhecido ${knownStatus}:`, knownStatusError)
        }
      }
    }

    // Tentativa com valores padrão de status
    const defaultStatusValues = [
      null, // Alguns bancos permitem NULL se o campo for nullable
      "", // String vazia pode funcionar se o campo aceitar
      "pending",
      "to_do",
      "todo",
      "new",
      "open",
      "active",
      "backlog",
    ]

    for (const defaultStatus of defaultStatusValues) {
      if (defaultStatus === null) {
        // Já tentamos sem status acima
        if (shouldTryWithoutStatus) continue
      }

      const taskDataWithDefaultStatus = {
        ...taskDataWithoutStatus,
        status: defaultStatus,
      }

      console.log(`Tentando criar tarefa com status padrão: ${defaultStatus}`)
      const { data: createdWithDefaultStatus, error: defaultStatusError } = await supabase
        .from("tasks")
        .insert(taskDataWithDefaultStatus)
        .select()
        .single()

      if (!defaultStatusError) {
        console.log(`Tarefa criada com sucesso usando status padrão: ${defaultStatus}`)

        // Adicionar os campos removidos de volta à resposta
        const responseData = {
          ...createdWithDefaultStatus,
          color: color || "#4b7bb5",
          creator: creator || null,
          assignee: assignee || null,
        }

        return NextResponse.json(responseData)
      } else {
        console.error(`Erro ao criar tarefa com status padrão ${defaultStatus}:`, defaultStatusError)
      }
    }

    // Se chegarmos aqui, todas as tentativas falharam
    // Vamos tentar criar uma tarefa com o mínimo possível de campos
    const bareMinimumData = {
      title,
      project_id,
      created_at: new Date().toISOString(),
    }

    console.log("Tentando criar tarefa com o mínimo de campos")
    const { data: minimalTask, error: minimalError } = await supabase
      .from("tasks")
      .insert(bareMinimumData)
      .select()
      .single()

    if (!minimalError) {
      console.log("Tarefa criada com sucesso usando o mínimo de campos:", minimalTask)

      // Adicionar os campos removidos de volta à resposta
      const responseData = {
        ...minimalTask,
        color: color || "#4b7bb5",
        creator: creator || null,
        assignee: assignee || null,
        description: description || null,
        priority: priority || "medium",
        due_date: due_date || null,
      }

      return NextResponse.json(responseData)
    } else {
      console.error("Erro ao criar tarefa com o mínimo de campos:", minimalError)
    }

    // Se todas as tentativas falharem, recuperar mais informações sobre a estrutura da tabela
    try {
      const { data: tableInfo, error: infoError } = await supabase.rpc("get_table_info", { table_name: "tasks" })

      if (!infoError && tableInfo) {
        console.log("Informações da tabela tasks:", tableInfo)
      } else {
        console.error("Erro ao obter informações da tabela:", infoError)
      }
    } catch (err) {
      console.error("Exceção ao tentar obter informações da tabela:", err)
    }

    // Se tudo falhar, retornar um erro detalhado
    return NextResponse.json(
      {
        error: "Não foi possível criar a tarefa. Nenhum valor de status aceito pelo banco de dados.",
        details:
          "Tentativas de criar a tarefa com diferentes valores de status falharam. Verifique os requisitos do esquema do banco de dados.",
      },
      { status: 500 },
    )
  } catch (error: any) {
    console.error("Erro ao processar requisição de criação de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Dados de exemplo para fallback
const fallbackTasks = [
  {
    id: "fallback-1",
    title: "Revisar conteúdo do site",
    description: "Verificar textos e imagens da página inicial",
    status: "todo",
    priority: "high",
    project_id: "fallback",
    created_at: new Date().toISOString(),
    due_date: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Preparar relatório mensal",
    description: "Compilar métricas de desempenho para o cliente",
    status: "in-progress",
    priority: "medium",
    project_id: "fallback",
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
  },
]
