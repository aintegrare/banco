import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const withPostCount = searchParams.get("withPostCount") === "true"

    if (withPostCount) {
      // Buscar categorias com contagem de posts
      const { data, error } = await supabase.rpc("get_categories_with_post_count")

      if (error) {
        throw error
      }

      return NextResponse.json(data)
    } else {
      // Buscar apenas categorias
      const { data, error } = await supabase.from("blog_categories").select("*").order("name")

      if (error) {
        throw error
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json({ error: "Erro ao buscar categorias do blog" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Validar dados
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 })
    }

    // Verificar se o slug já existe
    const { data: existingCategory, error: slugCheckError } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle()

    if (slugCheckError) {
      throw slugCheckError
    }

    if (existingCategory) {
      return NextResponse.json({ error: "Já existe uma categoria com este slug" }, { status: 400 })
    }

    // Inserir categoria
    const { data: newCategory, error } = await supabase
      .from("blog_categories")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(newCategory)
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json({ error: "Erro ao criar categoria do blog" }, { status: 500 })
  }
}
