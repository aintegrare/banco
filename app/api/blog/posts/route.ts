import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      author:authors(id, name, avatar),
      category:categories(id, name, slug)
    `)
    .order("published_at", { ascending: false })

  if (category) {
    query = query.eq("category_id", category)
  }

  if (status) {
    query = query.eq("status", status)
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

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert([
      {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        cover_image: data.coverImage,
        author_id: data.authorId,
        category_id: data.categoryId,
        status: data.status,
        published_at: data.publishedAt,
        featured: data.featured,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        tags: data.tags,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ post })
}
