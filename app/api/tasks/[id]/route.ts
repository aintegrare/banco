import { NextResponse } from "next/server"
import { getTaskById, updateTask, deleteTask, updateTaskStatus } from "@/lib/unified-task-manager"
import type { UpdateTaskInput } from "@/lib/unified-task-manager"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const task = await getTaskById(id)
    return NextResponse.json(task)
  } catch (error: any) {
    console.error(`Erro ao buscar tarefa ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao buscar tarefa" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const body = await request.json()
    console.log(`Atualizando tarefa ${id} com dados:`, body)

    const {
      title,
      description,
      status,
      priority,
      project_id,
      assigned_to,
      due_date,
      estimated_hours,
      actual_hours,
      tags,
      subtasks,
    } = body

    const taskData: UpdateTaskInput = {
      title,
      description,
      status,
      priority,
      project_id,
      assigned_to,
      due_date,
      estimated_hours,
      actual_hours,
      tags,
      subtasks,
    }

    const updatedTask = await updateTask(id, taskData)
    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error(`Erro ao atualizar tarefa ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao atualizar tarefa" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    await deleteTask(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Erro ao excluir tarefa ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao excluir tarefa" }, { status: 500 })
  }
}

// Adicionar uma função PATCH específica para atualizar apenas o status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const body = await request.json()
    console.log(`Atualizando status da tarefa ${id} para:`, body.status)

    if (!body.status) {
      return NextResponse.json({ error: "Status não fornecido" }, { status: 400 })
    }

    // Usar a função específica para atualizar apenas o status
    const updatedTask = await updateTaskStatus(id, body.status)
    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error(`Erro ao atualizar status da tarefa ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao atualizar status da tarefa" }, { status: 500 })
  }
}
