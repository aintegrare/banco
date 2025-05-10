import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogAuthor } from "@/components/blog/blog-author"
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts"
import { BlogShareButtons } from "@/components/blog/blog-share-buttons"
import { BlogCategories } from "@/components/blog/blog-categories"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// Função para buscar o post pelo slug
async function getPostBySlug(slug: string) {
  try {
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

    return data
  } catch (error) {
    console.error("Erro ao buscar post:", error)
    return null
  }
}

// Função para buscar posts relacionados
async function getRelatedPosts(categoryId: string, currentPostId: string) {
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
  // Buscar o post pelo slug
  const post = await getPostBySlug(params.slug)

  // Se o post não foi encontrado, mostrar página 404
  if (!post) {
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
            {post?.author && <BlogAuthor author={post.author} />}

            {/* Compartilhar */}
            <BlogShareButtons
              title={post?.title || "Post do Blog Integrare"}
              url={`https://contatos.redeintegrare.com.br/blog/${params.slug}`}
            />
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            {/* Categorias */}
            <BlogCategories />

            {/* Posts relacionados */}
            <BlogRelatedPosts posts={relatedPosts} />

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
