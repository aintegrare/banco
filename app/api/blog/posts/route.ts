import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""

    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = createClient()

    let query = supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:blog_authors(id, name, avatar_url),
        category:blog_categories(id, name, slug)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq("category_id", category)
    }

    if (status) {
      query = query.eq("published", status === "published")
    }

    const { data, count, error } = await query.range(from, to)

    if (error) throw error

    return NextResponse.json({
      posts: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createClient()

    // Verificar se o slug já existe
    const { data: existingPost, error: checkError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", body.slug)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingPost) {
      return NextResponse.json({ error: "Já existe um post com este slug. Por favor, escolha outro." }, { status: 400 })
    }

    // Adicionar campos obrigatórios se não existirem
    if (!body.created_at) {
      body.created_at = new Date().toISOString()
    }

    if (!body.updated_at) {
      body.updated_at = new Date().toISOString()
    }

    // Inserir o post
    const { data, error } = await supabase.from("blog_posts").insert(body).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return NextResponse.json({ error: `Erro ao criar post: ${error.message}` }, { status: 500 })
  }
}
