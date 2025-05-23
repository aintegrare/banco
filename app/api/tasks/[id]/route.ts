import { NextResponse } from "next/server"
import {
  getSimpleTaskById,
  updateSimpleTask,
  updateSimpleTaskStatus,
  deleteSimpleTask,
} from "@/lib/simple-task-service"

function extractTaskId(idParam: string): number {
  const cleanId = idParam.trim()

  if (cleanId.includes("example")) {
    throw new Error(`ID de exemplo não permitido: "${cleanId}"`)
  }

  const numericId = Number.parseInt(cleanId, 10)

  if (isNaN(numericId) || numericId <= 0) {
    throw new Error(`ID inválido: "${cleanId}". Deve ser um número positivo.`)
  }

  return numericId
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🌐 GET /api/tasks/${params.id} iniciado (versão simples)`)

    const taskId = extractTaskId(params.id)
    const task = await getSimpleTaskById(taskId)

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    console.error(`❌ GET /api/tasks/${params.id} error:`, error)
    const status = error.message.includes("não encontrada") ? 404 : 400
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🌐 PUT /api/tasks/${params.id} iniciado (versão simples)`)

    const taskId = extractTaskId(params.id)
    const body = await request.json()

    const task = await updateSimpleTask(taskId, body)

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    console.error(`❌ PUT /api/tasks/${params.id} error:`, error)
    const status = error.message.includes("não encontrada") ? 404 : 400
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status },
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🌐 PATCH /api/tasks/${params.id} iniciado (versão simples)`)

    const taskId = extractTaskId(params.id)
    const body = await request.json()

    let task
    if (body.status) {
      // Atualização otimizada para status
      task = await updateSimpleTaskStatus(taskId, body.status)
    } else {
      // Atualização parcial normal
      task = await updateSimpleTask(taskId, body)
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    console.error(`❌ PATCH /api/tasks/${params.id} error:`, error)
    const status = error.message.includes("não encontrada") ? 404 : 400
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🌐 DELETE /api/tasks/${params.id} iniciado (versão simples)`)

    const taskId = extractTaskId(params.id)
    await deleteSimpleTask(taskId)

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error(`❌ DELETE /api/tasks/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    )
  }
}
