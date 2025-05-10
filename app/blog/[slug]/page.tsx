import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-[#4b7bb5] hover:text-[#3d649e] hover:bg-[#f2f1ef]/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Blog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabeçalho do post */}
            <div>
              <div className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded-md mb-4">
                {post?.category?.name || "Sem categoria"}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#4072b0] mb-4">
                {post?.title || "Post não encontrado"}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post?.read_time || "3 min"} de leitura</span>
                </div>
              </div>
            </div>

            {/* Imagem de capa */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={post?.featured_image || "/placeholder.svg?height=600&width=1200&query=blog post"}
                alt={post?.title || "Post não encontrado"}
                className="w-full h-auto"
              />
            </div>

            {/* Conteúdo do post */}
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content || "<p>Conteúdo não disponível</p>" }}
            />

            {/* Autor */}
            {post?.author && (
              <div className="bg-white rounded-lg p-6 flex items-start space-x-4">
                <img
                  src={post.author.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#4072b0]">{post.author.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{post.author.bio || "Autor do blog da Integrare."}</p>
                </div>
              </div>
            )}

            {/* Compartilhar */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#4072b0] mb-4">Compartilhe este artigo</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                  Facebook
                </Button>
                <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                  Twitter
                </Button>
                <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                  LinkedIn
                </Button>
                <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            {/* Categorias */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#4072b0] mb-4">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog/categoria/marketing-digital"
                  className="px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm"
                >
                  Marketing Digital
                </Link>
                <Link
                  href="/blog/categoria/seo"
                  className="px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm"
                >
                  SEO
                </Link>
                <Link
                  href="/blog/categoria/redes-sociais"
                  className="px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm"
                >
                  Redes Sociais
                </Link>
                <Link
                  href="/blog/categoria/analise-de-dados"
                  className="px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm"
                >
                  Análise de Dados
                </Link>
              </div>
            </div>

            {/* Posts relacionados */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#4072b0] mb-4">Posts Relacionados</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={relatedPost.featured_image || "/placeholder.svg?height=100&width=100&query=blog"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2"
                        >
                          {relatedPost.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{relatedPost.read_time} de leitura</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-[#4b7bb5] rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Inscreva-se na Newsletter</h3>
              <p className="text-sm mb-4">Receba nossos conteúdos exclusivos diretamente no seu e-mail.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-3 py-2 rounded-md text-gray-800 text-sm"
                />
                <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100">Inscrever-se</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
