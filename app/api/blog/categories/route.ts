import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  const { data: categories, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const data = await request.json()

  const { data: category, error } = await supabase
    .from("blog_categories")
    .insert([
      {
        name: data.name,
        slug: data.slug,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ category })
}
