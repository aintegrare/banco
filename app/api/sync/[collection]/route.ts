import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request, { params }: { params: { collection: string } }) {
  const collection = params.collection

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar a coleção
    const validCollections = ["tasks", "projects", "clients", "documents", "posts"]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: "Coleção inválida" }, { status: 400 })
    }

    // Inserir ou atualizar o item na coleção apropriada
    let result

    switch (collection) {
      case "tasks":
        result = await supabase.from("tasks").upsert(body).select()
        break
      case "projects":
        result = await supabase.from("projects").upsert(body).select()
        break
      case "clients":
        result = await supabase.from("clients").upsert(body).select()
        break
      case "documents":
        result = await supabase.from("documents").upsert(body).select()
        break
      case "posts":
        result = await supabase.from("posts").upsert(body).select()
        break
    }

    if (result.error) {
      console.error(`Erro ao sincronizar ${collection}:`, result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error: any) {
    console.error(`Erro ao processar sincronização de ${collection}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao processar sincronização" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { collection: string } }) {
  const collection = params.collection
  const url = new URL(request.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar a coleção
    const validCollections = ["tasks", "projects", "clients", "documents", "posts"]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: "Coleção inválida" }, { status: 400 })
    }

    // Atualizar o item na coleção apropriada
    let result

    switch (collection) {
      case "tasks":
        result = await supabase.from("tasks").update(body).eq("id", id).select()
        break
      case "projects":
        result = await supabase.from("projects").update(body).eq("id", id).select()
        break
      case "clients":
        result = await supabase.from("clients").update(body).eq("id", id).select()
        break
      case "documents":
        result = await supabase.from("documents").update(body).eq("id", id).select()
        break
      case "posts":
        result = await supabase.from("posts").update(body).eq("id", id).select()
        break
    }

    if (result.error) {
      console.error(`Erro ao atualizar ${collection}:`, result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error: any) {
    console.error(`Erro ao processar atualização de ${collection}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao processar atualização" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { collection: string } }) {
  const collection = params.collection
  const url = new URL(request.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: session } = await supabase.auth.getSession()

    if (!session?.session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Validar a coleção
    const validCollections = ["tasks", "projects", "clients", "documents", "posts"]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: "Coleção inválida" }, { status: 400 })
    }

    // Excluir o item da coleção apropriada
    let result

    switch (collection) {
      case "tasks":
        result = await supabase.from("tasks").delete().eq("id", id)
        break
      case "projects":
        result = await supabase.from("projects").delete().eq("id", id)
        break
      case "clients":
        result = await supabase.from("clients").delete().eq("id", id)
        break
      case "documents":
        result = await supabase.from("documents").delete().eq("id", id)
        break
      case "posts":
        result = await supabase.from("posts").delete().eq("id", id)
        break
    }

    if (result.error) {
      console.error(`Erro ao excluir ${collection}:`, result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Erro ao processar exclusão de ${collection}:`, error)
    return NextResponse.json({ error: error.message || "Erro ao processar exclusão" }, { status: 500 })
  }
}
