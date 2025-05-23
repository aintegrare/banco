import { NextResponse } from "next/server"
import { taskService } from "@/lib/services/task-service"
import { TASK_STATUS, PRIORITY } from "@/lib/types"

export async function POST(request: Request) {
  try {
    console.log("🔨 Criando tarefas de exemplo...")

    const exampleTasks = [
      {
        title: "Configurar ambiente de desenvolvimento",
        description: "Instalar dependências e configurar o projeto inicial",
        status: TASK_STATUS.TODO,
        priority: PRIORITY.HIGH,
      },
      {
        title: "Implementar autenticação de usuários",
        description: "Sistema completo de login, registro e recuperação de senha",
        status: TASK_STATUS.IN_PROGRESS,
        priority: PRIORITY.HIGH,
      },
      {
        title: "Criar dashboard principal",
        description: "Interface principal da aplicação com métricas e navegação",
        status: TASK_STATUS.BACKLOG,
        priority: PRIORITY.MEDIUM,
      },
      {
        title: "Implementar sistema de notificações",
        description: "Notificações em tempo real para usuários",
        status: TASK_STATUS.BACKLOG,
        priority: PRIORITY.MEDIUM,
      },
      {
        title: "Escrever testes unitários",
        description: "Cobertura de testes para funcionalidades críticas",
        status: TASK_STATUS.BACKLOG,
        priority: PRIORITY.LOW,
      },
      {
        title: "Documentação da API",
        description: "Documentar todos os endpoints da API",
        status: TASK_STATUS.REVIEW,
        priority: PRIORITY.MEDIUM,
      },
    ]

    const createdTasks = []

    for (const taskData of exampleTasks) {
      try {
        const task = await taskService.createTask(taskData)
        createdTasks.push(task)
        console.log(`✅ Tarefa criada: ${task.title} (ID: ${task.id})`)
      } catch (error: any) {
        console.warn(`⚠️ Erro ao criar tarefa "${taskData.title}":`, error.message)
      }
    }

    console.log(`🎉 ${createdTasks.length} tarefas de exemplo criadas com sucesso`)

    return NextResponse.json(
      {
        success: true,
        data: createdTasks,
        message: `${createdTasks.length} tarefas de exemplo criadas com sucesso`,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("❌ Erro ao criar tarefas de exemplo:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
