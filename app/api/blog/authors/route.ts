import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  const { data: authors, error } = await supabase.from("blog_authors").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ authors })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const data = await request.json()

  const { data: author, error } = await supabase
    .from("blog_authors")
    .insert([
      {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        email: data.email,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ author })
}
