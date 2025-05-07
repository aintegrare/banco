import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:authors(id, name, avatar, bio),
      category:categories(id, name, slug)
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ post })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const data = await request.json()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .update({
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
    })
    .eq("id", params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ post })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
