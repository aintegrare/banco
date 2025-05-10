import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Buscando post com ID/slug: ${params.id}`)
    const supabase = createClient()

    // Verificar se é um ID numérico ou um slug
    const isNumeric = /^\d+$/.test(params.id)

    let query = supabase.from("blog_posts").select(`
        *,
        blog_categories(id, name, slug),
        blog_authors(id, name, avatar_url, bio)
      `)

    if (isNumeric) {
      query = query.eq("id", params.id)
    } else {
      query = query.eq("slug", params.id)
    }

    const { data: post, error } = await query.single()

    if (error) {
      console.error(`Erro ao buscar post: ${error.message}`)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
      }
      throw error
    }

    console.log(`Post encontrado: ${post.title}`)
    return NextResponse.json(post)
  } catch (error) {
    console.error("Erro ao buscar post:", error)
    return NextResponse.json({ error: "Erro ao buscar post do blog" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Validar dados
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 })
    }

    // Verificar se o slug já existe (exceto para o próprio post)
    const { data: existingPost, error: slugCheckError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", data.slug)
      .neq("id", params.id)
      .maybeSingle()

    if (slugCheckError) {
      throw slugCheckError
    }

    if (existingPost) {
      return NextResponse.json({ error: "Já existe outro post com este slug" }, { status: 400 })
    }

    // Atualizar post
    const { data: updatedPost, error } = await supabase
      .from("blog_posts")
      .update({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featured_image,
        author_id: data.author_id,
        category_id: data.category_id,
        published: data.published,
        published_at: data.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Erro ao atualizar post:", error)
    return NextResponse.json({ error: "Erro ao atualizar post do blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Excluir post
    const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir post:", error)
    return NextResponse.json({ error: "Erro ao excluir post do blog" }, { status: 500 })
  }
}
