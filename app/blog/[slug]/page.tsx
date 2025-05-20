import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { BlogShareButtons } from "@/components/blog/blog-share-buttons"
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogAuthor } from "@/components/blog/blog-author"

// Função para calcular o tempo de leitura
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content ? content.split(/\s+/).length : 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

// Função para buscar o post pelo slug
async function getPostBySlug(slug: string) {
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
async function getRelatedPosts(categoryId: number, currentPostId: number) {
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
async function getAdjacentPosts(currentPostId: number) {
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post não encontrado | Blog Integrare",
      description: "O post que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${post.title} | Blog Integrare`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featured_image }],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author?.name],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  console.log(`Renderizando página para slug: ${params.slug}`)

  // Buscar o post pelo slug
  const post = await getPostBySlug(params.slug)

  // Se o post não foi encontrado, mostrar página 404
  if (!post) {
    console.log(`Post não encontrado para slug: ${params.slug}`)
    notFound()
  }

  // Formatar a data de publicação
  const publishDate = post?.published_at ? new Date(post.published_at) : new Date()
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Buscar posts relacionados
  const relatedPosts = post?.category?.id ? await getRelatedPosts(post.category.id, post.id) : []

  // Buscar posts adjacentes (anterior e próximo)
  const adjacentPosts = await getAdjacentPosts(post.id)

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero section com imagem de fundo */}
      <div
        className="relative bg-cover bg-center py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${post?.featured_image || "/blog-post-concept.png"})`,
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded-md mb-4">
            {post?.category?.name || "Sem categoria"}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
            {post?.title || "Post não encontrado"}
          </h1>
          <div className="flex items-center justify-center text-sm text-white/80 space-x-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post?.read_time || "3 min"} de leitura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo principal */}
          <div className="lg:w-2/3 space-y-8">
            {/* Navegação */}
            <div className="flex justify-between items-center mb-8">
              <Link href="/blog">
                <Button variant="ghost" className="text-[#4b7bb5] hover:text-[#3d649e] hover:bg-[#f2f1ef]/80">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Blog
                </Button>
              </Link>
            </div>

            {/* Conteúdo do post */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
              <div
                className="prose prose-lg max-w-none prose-headings:text-[#4072b0] prose-a:text-[#4b7bb5] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post?.content || "<p>Conteúdo não disponível</p>" }}
              />
            </div>

            {/* Navegação entre posts */}
            <div className="flex justify-between items-center mt-8 gap-4">
              {adjacentPosts.prev ? (
                <Link href={`/blog/${adjacentPosts.prev.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-start border-[#4b7bb5] text-[#4b7bb5]">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="truncate">{adjacentPosts.prev.title}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}

              {adjacentPosts.next ? (
                <Link href={`/blog/${adjacentPosts.next.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-end border-[#4b7bb5] text-[#4b7bb5]">
                    <span className="truncate">{adjacentPosts.next.title}</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}
            </div>

            {/* Autor */}
            {post?.author && <BlogAuthor author={post.author} />}

            {/* Compartilhar */}
            <BlogShareButtons
              title={post.title}
              url={typeof window !== "undefined" ? window.location.href : `https://integrare.com.br/blog/${post.slug}`}
            />
          </div>

          {/* Barra lateral */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categorias */}
            <BlogCategories />

            {/* Posts relacionados */}
            {relatedPosts.length > 0 && <BlogRelatedPosts posts={relatedPosts} />}

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Inscreva-se na Newsletter</h3>
              <p className="text-sm mb-4 text-white/90">
                Receba nossos conteúdos exclusivos diretamente no seu e-mail.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-[#6b91c1] focus:outline-none"
                />
                <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100 py-5">Inscrever-se</Button>
              </div>
            </div>

            {/* CTA para contato */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#4b7bb5]">
              <h3 className="text-lg font-bold text-[#4072b0] mb-2">Precisa de ajuda com marketing?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nossa equipe está pronta para ajudar sua empresa a alcançar resultados excepcionais.
              </p>
              <Link href="/contato">
                <Button className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]">Fale com um especialista</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
