import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogSearch } from "@/components/blog/blog-search"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { BlogFeaturedPost } from "@/components/blog/blog-featured-post"
import { Input } from "@/components/ui/input"

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
    <div className="min-h-screen bg-[#f2f1ef] dark:bg-gray-900">
      {/* Header com estado de scroll */}
      <Header isScrolled={true} />

      {/* Hero Section do Blog */}
      <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] dark:from-[#3d649e] dark:to-[#1e3c64] text-white">
        {/* Elementos decorativos flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6b91c1]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#4072b0]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#527eb7]/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 animate-fadeIn">
              Blog da Integrare
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Conteúdos sobre Marketing, Negócios e Tecnologia
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Fique por dentro das últimas tendências e estratégias para impulsionar seu negócio
            </p>

            {/* Barra de pesquisa */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar no blog..."
                  className="pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="currentColor"
              fillOpacity="1"
              className="text-[#f2f1ef] dark:text-gray-900"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#4072b0] dark:text-[#6b91c1]">Posts Recentes</h2>
          <Link href="/blog/admin/novo">
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post em destaque */}
            {featuredPost && (
              <div className="mb-12 transform transition-all duration-500 hover:translate-y-[-5px]">
                <BlogFeaturedPost post={featuredPost} />
              </div>
            )}

            {/* Lista de posts */}
            <div className="space-y-6">
              {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <div key={post.id} className="transform transition-all duration-500 hover:translate-y-[-5px]">
                      <BlogPostCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
                  <p className="text-gray-600 dark:text-gray-400">Nenhum post encontrado.</p>
                </div>
              )}

              {/* Paginação */}
              {regularPosts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5]/10">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                    </Button>
                    <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">1</Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5]/10">
                      2
                    </Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5]/10">
                      3
                    </Button>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5]/10">
                      Próxima <ChevronRight className="h-4 w-4 ml-1" />
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-4">Posts Populares</h3>
              <div className="space-y-4">
                {postsWithReadTime.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start space-x-3 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={post.featured_image || "/placeholder.svg?height=100&width=100&query=blog"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2 transition-colors"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.read_time} de leitura</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] rounded-lg shadow-sm p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Inscreva-se na Newsletter</h3>
                <p className="text-sm mb-4 text-white/90">
                  Receba nossos conteúdos exclusivos diretamente no seu e-mail.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full px-3 py-2 rounded-md text-gray-800 text-sm border-0 focus:ring-2 focus:ring-white/30"
                  />
                  <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100 transition-colors">
                    Inscrever-se
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
