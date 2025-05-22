import { createClient } from "@/lib/supabase/server"

// Função para calcular o tempo de leitura
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content ? content.split(/\s+/).length : 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

// Função para buscar o post pelo slug
export async function getPostBySlug(slug: string) {
  try {
    console.log(`Buscando post com slug: ${slug}`)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        author:blog_authors(id, name, avatar_url, bio),
        category:blog_categories(id, name, slug)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Erro ao buscar post:", error)
      return null
    }

    console.log(`Post encontrado:`, data)

    // Adicionar tempo de leitura
    if (data) {
      data.read_time = calculateReadTime(data.content)
    }

    return data
  } catch (error) {
    console.error("Erro ao buscar post:", error)
    return null
  }
}

// Função para buscar posts relacionados
export async function getRelatedPosts(categoryId: number, currentPostId: number) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        content,
        published_at,
        author:blog_authors(id, name, avatar_url),
        category:blog_categories(id, name, slug)
      `)
      .eq("category_id", categoryId)
      .neq("id", currentPostId)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Erro ao buscar posts relacionados:", error)
      return []
    }

    // Adicionar tempo de leitura
    if (data) {
      data.forEach((post) => {
        post.read_time = calculateReadTime(post.content)
      })
    }

    return data
  } catch (error) {
    console.error("Erro ao buscar posts relacionados:", error)
    return []
  }
}

// Função para buscar posts anteriores e próximos
export async function getAdjacentPosts(currentPostId: number) {
  try {
    const supabase = createClient()

    // Buscar post anterior (publicado antes do atual)
    const { data: prevPost, error: prevError } = await supabase
      .from("blog_posts")
      .select("id, title, slug")
      .lt("id", currentPostId)
      .eq("published", true)
      .order("id", { ascending: false })
      .limit(1)
      .single()

    // Buscar próximo post (publicado depois do atual)
    const { data: nextPost, error: nextError } = await supabase
      .from("blog_posts")
      .select("id, title, slug")
      .gt("id", currentPostId)
      .eq("published", true)
      .order("id", { ascending: true })
      .limit(1)
      .single()

    return {
      prev: prevError ? null : prevPost,
      next: nextError ? null : nextPost,
    }
  } catch (error) {
    console.error("Erro ao buscar posts adjacentes:", error)
    return { prev: null, next: null }
  }
}
