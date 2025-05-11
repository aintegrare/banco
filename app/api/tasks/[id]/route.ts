import { NextResponse } from "next/server"
import { getTaskById, updateTask, deleteTask, updateTaskStatus } from "@/lib/unified-task-manager"
import type { UpdateTaskInput } from "@/lib/unified-task-manager"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const task = await getTaskById(taskId)

    return NextResponse.json(task)
  } catch (error: any) {
    console.error(`Erro ao buscar tarefa:`, error)
    return NextResponse.json({ error: error.message || "Erro ao buscar tarefa" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const body = await request.json()
    console.log(`Atualizando tarefa ${taskId} com dados:`, body)

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
      order_position,
      subtasks,
      color,
      creator,
      assignee,
    } = body

    const updates: UpdateTaskInput = {}

    // Adicionar apenas os campos fornecidos
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (status !== undefined) updates.status = status
    if (priority !== undefined) updates.priority = priority
    if (project_id !== undefined) updates.project_id = project_id
    if (assigned_to !== undefined) updates.assigned_to = assigned_to
    if (due_date !== undefined) updates.due_date = due_date
    if (estimated_hours !== undefined) updates.estimated_hours = estimated_hours
    if (actual_hours !== undefined) updates.actual_hours = actual_hours
    if (tags !== undefined) updates.tags = tags
    if (order_position !== undefined) updates.order_position = order_position
    if (subtasks !== undefined) updates.subtasks = subtasks

    console.log("Dados a serem enviados para atualização:", updates)

    const updatedTask = await updateTask(taskId, updates)
    console.log("Tarefa atualizada com sucesso:", updatedTask)

    // Adicionar campos virtuais para o frontend
    const responseData = {
      ...updatedTask,
      color: color || "#4b7bb5",
      creator: creator || null,
      assignee: assignee || null,
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error(`Erro ao atualizar tarefa:`, error)
    return NextResponse.json({ error: error.message || "Erro ao atualizar tarefa" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    await deleteTask(taskId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Erro ao excluir tarefa:`, error)
    return NextResponse.json({ error: error.message || "Erro ao excluir tarefa" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "ID de tarefa inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 })
    }

    console.log(`Atualizando status da tarefa ${taskId} para ${status}`)
    const updatedTask = await updateTaskStatus(taskId, status)
    console.log("Tarefa atualizada com sucesso:", updatedTask)

    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error(`Erro ao atualizar status da tarefa:`, error)
    return NextResponse.json({ error: error.message || "Erro ao atualizar status da tarefa" }, { status: 500 })
  }
}
