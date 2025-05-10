import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogFeaturedPost } from "@/components/blog/blog-featured-post"
import { BlogSearch } from "@/components/blog/blog-search"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Blog | Integrare",
  description: "Conteúdos sobre marketing, negócios e tecnologia da Integrare",
}

// Função para buscar posts do banco de dados
async function getPosts() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        author:blog_authors(id, name, avatar_url),
        category:blog_categories(id, name, slug)
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Erro ao buscar posts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return []
  }
}

// Dados de exemplo para os posts do blog (usados apenas se não houver dados no banco)
const dummyPosts = [
  {
    id: "1",
    title: "Como o Marketing Digital Transformou os Negócios em 2023",
    slug: "como-o-marketing-digital-transformou-os-negocios-em-2023",
    excerpt:
      "Descubra as principais tendências de marketing digital que impactaram os negócios no último ano e como se preparar para o futuro.",
    content: "",
    featured_image: "/digital-marketing-concept.png",
    author: {
      id: 1,
      name: "Ana Silva",
      avatar_url: "/woman-profile.png",
    },
    category: {
      id: 1,
      name: "Marketing Digital",
      slug: "marketing-digital",
    },
    published_at: "2023-12-15T10:00:00Z",
    read_time: "5 min",
    featured: true,
  },
  {
    id: "2",
    title: "Estratégias de SEO para Pequenas Empresas",
    slug: "estrategias-de-seo-para-pequenas-empresas",
    excerpt:
      "Um guia completo sobre como pequenas empresas podem melhorar seu posicionamento nos mecanismos de busca sem grandes investimentos.",
    content: "",
    featured_image: "/seo-strategies-concept.png",
    author: {
      id: 2,
      name: "Carlos Mendes",
      avatar_url: "/man-profile.png",
    },
    category: {
      id: 2,
      name: "SEO",
      slug: "seo",
    },
    published_at: "2023-11-28T14:30:00Z",
    read_time: "8 min",
    featured: false,
  },
  {
    id: "3",
    title: "O Poder das Redes Sociais para Engajamento de Clientes",
    slug: "o-poder-das-redes-sociais-para-engajamento-de-clientes",
    excerpt:
      "Como utilizar as redes sociais de forma estratégica para aumentar o engajamento e a fidelização de clientes.",
    content: "",
    featured_image: "/social-media-marketing.png",
    author: {
      id: 3,
      name: "Juliana Costa",
      avatar_url: "/professional-woman-profile.png",
    },
    category: {
      id: 3,
      name: "Redes Sociais",
      slug: "redes-sociais",
    },
    published_at: "2023-11-10T09:15:00Z",
    read_time: "6 min",
    featured: false,
  },
  {
    id: "4",
    title: "Análise de Dados: Como Tomar Decisões Baseadas em Informações",
    slug: "analise-de-dados-como-tomar-decisoes-baseadas-em-informacoes",
    excerpt:
      "A importância da análise de dados para tomada de decisões estratégicas e como implementar uma cultura data-driven na sua empresa.",
    content: "",
    featured_image: "/data-analysis-visual.png",
    author: {
      id: 4,
      name: "Ricardo Oliveira",
      avatar_url: "/man-profile-glasses.png",
    },
    category: {
      id: 4,
      name: "Análise de Dados",
      slug: "analise-de-dados",
    },
    published_at: "2023-10-25T16:45:00Z",
    read_time: "7 min",
    featured: false,
  },
  {
    id: "5",
    title: "E-mail Marketing: Estratégias que Realmente Funcionam",
    slug: "email-marketing-estrategias-que-realmente-funcionam",
    excerpt:
      "Dicas práticas para criar campanhas de e-mail marketing eficientes que geram conversões e fortalecem o relacionamento com clientes.",
    content: "",
    featured_image: "/email-marketing-concept.png",
    author: {
      id: 5,
      name: "Fernanda Lima",
      avatar_url: "/woman-profile.png",
    },
    category: {
      id: 5,
      name: "E-mail Marketing",
      slug: "email-marketing",
    },
    published_at: "2023-10-12T11:20:00Z",
    read_time: "5 min",
    featured: false,
  },
  {
    id: "6",
    title: "Tendências de Marketing para 2024",
    slug: "tendencias-de-marketing-para-2024",
    excerpt:
      "As principais tendências de marketing que devem dominar o mercado em 2024 e como se preparar para aproveitar essas oportunidades.",
    content: "",
    featured_image: "/marketing-trends.png",
    author: {
      id: 6,
      name: "Paulo Santos",
      avatar_url: "/man-profile.png",
    },
    category: {
      id: 6,
      name: "Tendências",
      slug: "tendencias",
    },
    published_at: "2023-12-05T13:40:00Z",
    read_time: "9 min",
    featured: false,
  },
]

export default async function BlogPage() {
  // Buscar posts do banco de dados
  const dbPosts = await getPosts()

  // Usar dados do banco ou dados de exemplo se não houver dados no banco
  const blogPosts = dbPosts.length > 0 ? dbPosts : dummyPosts

  // Encontrar o post em destaque
  const featuredPost = blogPosts.find((post) => post.featured === true)

  // Filtrar os posts que não estão em destaque
  const regularPosts = blogPosts.filter((post) => post.featured !== true)

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
            {featuredPost && <BlogFeaturedPost post={featuredPost} />}

            {/* Lista de posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#4072b0]">Posts Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Paginação */}
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
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={post.featured_image || "/placeholder.svg"}
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
