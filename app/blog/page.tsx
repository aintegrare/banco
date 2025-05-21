import type { Metadata } from "next"
import Link from "next/link"
import { BlogFeaturedPost } from "@/components/blog/blog-featured-post"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogSearch } from "@/components/blog/blog-search"

export const metadata: Metadata = {
  title: "Blog Integrare | Marketing Digital e Estratégias de Negócios",
  description: "Confira as últimas tendências, dicas e estratégias de marketing digital para impulsionar seu negócio.",
}

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/posts`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Falha ao carregar os posts")
    }

    return res.json()
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return { posts: [] }
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/categories`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Falha ao carregar as categorias")
    }

    return res.json()
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return { categories: [] }
  }
}

export default async function BlogPage() {
  const { posts = [] } = await getPosts()
  const { categories = [] } = await getCategories()

  // Separar o post em destaque (o mais recente)
  const featuredPost = posts[0] || null
  const regularPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3d649e] to-[#4b7bb5] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Integrare</h1>
            <p className="text-xl opacity-90 mb-8">
              Insights, tendências e estratégias de marketing digital para impulsionar seu negócio
            </p>
            <BlogSearch />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2">
            {/* Post em destaque */}
            {featuredPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-[#3d649e] flex items-center">
                  <span className="inline-block w-8 h-1 bg-[#4b7bb5] mr-3"></span>
                  Post em Destaque
                </h2>
                <BlogFeaturedPost post={featuredPost} />
              </div>
            )}

            {/* Posts recentes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-[#3d649e] flex items-center">
                <span className="inline-block w-8 h-1 bg-[#4b7bb5] mr-3"></span>
                Posts Recentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Paginação */}
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="px-4 py-2 rounded-l-md border border-[#4b7bb5] bg-white text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white transition-colors"
                >
                  Anterior
                </a>
                <a href="#" className="px-4 py-2 border-t border-b border-[#4b7bb5] bg-[#4b7bb5] text-white">
                  1
                </a>
                <a
                  href="#"
                  className="px-4 py-2 border-t border-b border-[#4b7bb5] bg-white text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white transition-colors"
                >
                  2
                </a>
                <a
                  href="#"
                  className="px-4 py-2 border-t border-b border-[#4b7bb5] bg-white text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white transition-colors"
                >
                  3
                </a>
                <a
                  href="#"
                  className="px-4 py-2 rounded-r-md border border-[#4b7bb5] bg-white text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white transition-colors"
                >
                  Próximo
                </a>
              </nav>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="lg:col-span-1">
            {/* Pesquisa */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#3d649e]">Pesquisar</h3>
              <BlogSearch />
            </div>

            {/* Categorias */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#3d649e]">Categorias</h3>
              <BlogCategories categories={categories} />
            </div>

            {/* Posts populares */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#3d649e]">Posts Populares</h3>
              <ul className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <li key={post.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <h4 className="font-medium text-gray-800 group-hover:text-[#4b7bb5] transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(post.published_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#3d649e] to-[#4b7bb5] rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Inscreva-se na Newsletter</h3>
              <p className="text-sm opacity-90 mb-4">
                Receba as últimas novidades e dicas de marketing digital diretamente no seu email.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6b91c1]"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-[#3d649e] font-medium px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
