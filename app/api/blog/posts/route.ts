import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const published = searchParams.get("published")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      author:blog_authors(id, name, avatar_url, bio),
      category:blog_categories(id, name, slug)
    `)
    .order("published_at", { ascending: false })

  if (category) {
    query = query.eq("category_id", category)
  }

  if (published !== null) {
    query = query.eq("published", published === "true")
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  const { data: posts, error, count } = await query.range(offset, offset + limit - 1).limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    posts,
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const data = await request.json()

  // Primeiro, inserimos o post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert([
      {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featuredImage,
        author_id: data.authorId,
        category_id: data.categoryId,
        published: data.published || false,
        published_at: data.publishedAt,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Se houver tags, processamos elas
  if (data.tags && data.tags.length > 0) {
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
