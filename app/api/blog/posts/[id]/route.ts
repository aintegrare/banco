import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  // Buscar o post com autor e categoria
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:blog_authors(id, name, avatar_url, bio),
      category:blog_categories(id, name, slug)
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Buscar as tags do post
  const { data: postTags } = await supabase
    .from("blog_posts_tags")
    .select(`
      tag:blog_tags(id, name, slug)
    `)
    .eq("post_id", params.id)

  // Formatar as tags para um formato mais fácil de usar
  const tags = postTags ? postTags.map((pt) => pt.tag) : []

  return NextResponse.json({ post: { ...post, tags } })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const data = await request.json()

  // Atualizar o post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featured_image: data.featuredImage,
      author_id: data.authorId,
      category_id: data.categoryId,
      published: data.published,
      published_at: data.publishedAt,
    })
    .eq("id", params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Se houver tags, atualizamos elas
  if (data.tags) {
    // Primeiro, removemos todas as associações existentes
    await supabase.from("blog_posts_tags").delete().eq("post_id", params.id)

    const tags = Array.isArray(data.tags) ? data.tags : data.tags.split(",").map((tag) => tag.trim())

    for (const tagName of tags) {
      // Verificar se a tag já existe
      const { data: existingTag } = await supabase.from("blog_tags").select("id").eq("name", tagName).single()

      let tagId

      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Criar a tag se não existir
        const slug = tagName.toLowerCase().replace(/\s+/g, "-")
        const { data: newTag, error: tagError } = await supabase
          .from("blog_tags")
          .insert([{ name: tagName, slug }])
          .select()
          .single()

        if (tagError) {
          console.error("Erro ao criar tag:", tagError)
          continue
        }

        tagId = newTag.id
      }

      // Associar a tag ao post
      await supabase.from("blog_posts_tags").insert([{ post_id: post.id, tag_id: tagId }])
    }
  }

  return NextResponse.json({ post })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  // Primeiro, removemos todas as associações com tags
  await supabase.from("blog_posts_tags").delete().eq("post_id", params.id)

  // Depois, removemos o post
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
