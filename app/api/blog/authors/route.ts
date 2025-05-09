import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const withPostCount = searchParams.get("withPostCount") === "true"

    if (withPostCount) {
      // Buscar autores com contagem de posts
      const { data, error } = await supabase.rpc("get_authors_with_post_count")

      if (error) {
        throw error
      }

      return NextResponse.json(data)
    } else {
      // Buscar apenas autores
      const { data, error } = await supabase.from("blog_authors").select("*").order("name")

      if (error) {
        throw error
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Erro ao buscar autores:", error)
    return NextResponse.json({ error: "Erro ao buscar autores do blog" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Validar dados
    if (!data.name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    // Inserir autor
    const { data: newAuthor, error } = await supabase
      .from("blog_authors")
      .insert({
        name: data.name,
        email: data.email,
        bio: data.bio,
        avatar_url: data.avatar_url,
        social_links: data.social_links,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(newAuthor)
  } catch (error) {
    console.error("Erro ao criar autor:", error)
    return NextResponse.json({ error: "Erro ao criar autor do blog" }, { status: 500 })
  }
}
