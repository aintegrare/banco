import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogSearch } from "@/components/blog/blog-search"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Blog | Integrare",
  description: "Conteúdos sobre marketing, negócios e tecnologia da Integrare",
}

// Função para buscar posts do banco de dados
async function getPosts() {
  try {
    console.log("Buscando posts do blog...")
    const supabase = createClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        author:blog_authors(id, name, avatar_url),
        category:blog_categories(id, name, slug)
      `)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Erro ao buscar posts:", error)
      return []
    }

    console.log(`${data?.length || 0} posts encontrados`)
    return data || []
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return []
  }
}

// Função para calcular o tempo de leitura
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content ? content.split(/\s+/).length : 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

export default async function BlogPage() {
  // Buscar posts do banco de dados
  const posts = await getPosts()

  // Adicionar tempo de leitura aos posts
  const postsWithReadTime = posts.map((post) => ({
    ...post,
    read_time: calculateReadTime(post.content),
  }))

  // Encontrar o post mais recente para destacar
  const featuredPost = postsWithReadTime.length > 0 ? postsWithReadTime[0] : null

  // Filtrar os posts que não estão em destaque
  const regularPosts = postsWithReadTime.length > 1 ? postsWithReadTime.slice(1) : []

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Blog da Integrare"
        description="Conteúdos sobre marketing, negócios e tecnologia"
        actions={
          <Link href="/blog/admin/novo">
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post em destaque */}
            {featuredPost && (
              <div>
                <h2 className="text-2xl font-bold text-[#4072b0] mb-4">Post em Destaque</h2>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-64 md:h-auto overflow-hidden">
                      <img
                        src={
                          featuredPost.featured_image || "/placeholder.svg?height=400&width=600&query=marketing digital"
                        }
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded-md mb-4">
                          {featuredPost.category?.name || "Sem categoria"}
                        </div>

                        <Link href={`/blog/${featuredPost.slug}`}>
                          <h2 className="text-2xl font-bold text-[#4072b0] mb-3 hover:text-[#3d649e]">
                            {featuredPost.title}
                          </h2>
                        </Link>

                        <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-4">
                          <img
                            src={
                              featuredPost.author?.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"
                            }
                            alt={featuredPost.author?.name || "Autor"}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium text-[#4b7bb5]">{featuredPost.author?.name || "Autor"}</div>
                            <div className="text-xs text-gray-500">Autor</div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <span>{new Date(featuredPost.published_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center">
                            <span>{featuredPost.read_time} de leitura</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#4072b0]">Posts Recentes</h2>
              {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-600">Nenhum post encontrado.</p>
                </div>
              )}

              {/* Paginação */}
              {regularPosts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      Anterior
                    </Button>
                    <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">1</Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      2
                    </Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      3
                    </Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            <BlogSearch />
            <BlogCategories />

            {/* Posts populares */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#4072b0] mb-4">Posts Populares</h3>
              <div className="space-y-4">
                {postsWithReadTime.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={post.featured_image || "/placeholder.svg?height=100&width=100&query=blog"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{post.read_time} de leitura</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
