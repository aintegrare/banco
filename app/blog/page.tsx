import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowRight } from "lucide-react"
import { BlogFeaturedPost } from "@/components/blog/blog-featured-post"
import { BlogSearch } from "@/components/blog/blog-search"

export const metadata: Metadata = {
  title: "Blog | Integrare",
  description: "Conteúdos sobre marketing, negócios e tecnologia da Integrare",
}

// Dados de exemplo para os posts do blog
const blogPosts = [
  {
    id: "1",
    title: "Como o Marketing Digital Transformou os Negócios em 2023",
    slug: "como-o-marketing-digital-transformou-os-negocios-em-2023",
    excerpt:
      "Descubra as principais tendências de marketing digital que impactaram os negócios no último ano e como se preparar para o futuro.",
    content: "",
    coverImage: "/digital-marketing-concept.png",
    author: {
      name: "Ana Silva",
      avatar: "/woman-profile.png",
    },
    category: "Marketing Digital",
    publishedAt: "2023-12-15T10:00:00Z",
    readTime: "5 min",
    featured: true,
  },
  {
    id: "2",
    title: "Estratégias de SEO para Pequenas Empresas",
    slug: "estrategias-de-seo-para-pequenas-empresas",
    excerpt:
      "Um guia completo sobre como pequenas empresas podem melhorar seu posicionamento nos mecanismos de busca sem grandes investimentos.",
    content: "",
    coverImage: "/seo-strategies-concept.png",
    author: {
      name: "Carlos Mendes",
      avatar: "/man-profile.png",
    },
    category: "SEO",
    publishedAt: "2023-11-28T14:30:00Z",
    readTime: "8 min",
    featured: false,
  },
  {
    id: "3",
    title: "O Poder das Redes Sociais para Engajamento de Clientes",
    slug: "o-poder-das-redes-sociais-para-engajamento-de-clientes",
    excerpt:
      "Como utilizar as redes sociais de forma estratégica para aumentar o engajamento e a fidelização de clientes.",
    content: "",
    coverImage: "/social-media-marketing.png",
    author: {
      name: "Juliana Costa",
      avatar: "/professional-woman-profile.png",
    },
    category: "Redes Sociais",
    publishedAt: "2023-11-10T09:15:00Z",
    readTime: "6 min",
    featured: false,
  },
  {
    id: "4",
    title: "Análise de Dados: Como Tomar Decisões Baseadas em Informações",
    slug: "analise-de-dados-como-tomar-decisoes-baseadas-em-informacoes",
    excerpt:
      "A importância da análise de dados para tomada de decisões estratégicas e como implementar uma cultura data-driven na sua empresa.",
    content: "",
    coverImage: "/data-analysis-visual.png",
    author: {
      name: "Ricardo Oliveira",
      avatar: "/man-profile-glasses.png",
    },
    category: "Análise de Dados",
    publishedAt: "2023-10-25T16:45:00Z",
    readTime: "7 min",
    featured: false,
  },
  {
    id: "5",
    title: "E-mail Marketing: Estratégias que Realmente Funcionam",
    slug: "email-marketing-estrategias-que-realmente-funcionam",
    excerpt:
      "Dicas práticas para criar campanhas de e-mail marketing eficientes que geram conversões e fortalecem o relacionamento com clientes.",
    content: "",
    coverImage: "/email-marketing-campaign.png",
    author: {
      name: "Fernanda Lima",
      avatar: "/professional-woman-avatar.png",
    },
    category: "E-mail Marketing",
    publishedAt: "2023-10-12T11:20:00Z",
    readTime: "5 min",
    featured: false,
  },
  {
    id: "6",
    title: "Tendências de Marketing para 2024",
    slug: "tendencias-de-marketing-para-2024",
    excerpt:
      "As principais tendências de marketing que devem dominar o mercado em 2024 e como se preparar para aproveitar essas oportunidades.",
    content: "",
    coverImage: "/marketing-trends-2024.png",
    author: {
      name: "Paulo Santos",
      avatar: "/professional-man-avatar.png",
    },
    category: "Tendências",
    publishedAt: "2023-12-05T13:40:00Z",
    readTime: "9 min",
    featured: false,
  },
]

// Encontrar o post em destaque
const featuredPost = blogPosts.find((post) => post.featured)

// Filtrar os posts que não estão em destaque
const regularPosts = blogPosts.filter((post) => !post.featured)

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      {/* Header com padrão de fundo */}
      <div className="relative bg-[#4072b0] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/pattern-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog da Integrare</h1>
            <p className="text-xl opacity-90 mb-8">
              Conteúdos sobre marketing, negócios e tecnologia para impulsionar sua empresa
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/blog/admin/novo">
                <Button className="bg-white text-[#4072b0] hover:bg-gray-100">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Post
                </Button>
              </Link>
              <Link href="#categorias">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Explorar Categorias
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Forma decorativa */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-[#f2f1ef]"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Post em destaque */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#4072b0]">Post em Destaque</h2>
              <Link
                href="/blog/categoria/destaque"
                className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center text-sm font-medium"
              >
                Ver todos os destaques
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <BlogFeaturedPost post={featuredPost} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Lista de posts */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#4072b0]">Posts Recentes</h2>
                <Link
                  href="/blog/todos"
                  className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center text-sm font-medium"
                >
                  Ver todos os posts
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.slice(0, 4).map((post, index) => (
                  <div key={post.id}>
                    <BlogPostCard
                      post={{
                        id: Number(post.id),
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        featured_image: post.coverImage,
                        author: {
                          id: 1,
                          name: post.author.name,
                          avatar_url: post.author.avatar,
                        },
                        category: {
                          id: 1,
                          name: post.category,
                          slug: post.category.toLowerCase().replace(/ /g, "-"),
                        },
                        published_at: post.publishedAt,
                        readTime: post.readTime,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Paginação */}
              <div className="flex justify-center mt-12">
                <div className="inline-flex items-center rounded-md border border-[#4b7bb5]/20 bg-white p-1 shadow-sm">
                  <Button variant="outline" className="border-[#4b7bb5]/20 text-[#4b7bb5] hover:bg-[#4b7bb5]/5">
                    Anterior
                  </Button>
                  <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">1</Button>
                  <Button variant="outline" className="border-[#4b7bb5]/20 text-[#4b7bb5] hover:bg-[#4b7bb5]/5">
                    2
                  </Button>
                  <Button variant="outline" className="border-[#4b7bb5]/20 text-[#4b7bb5] hover:bg-[#4b7bb5]/5">
                    3
                  </Button>
                  <Button variant="outline" className="border-[#4b7bb5]/20 text-[#4b7bb5] hover:bg-[#4b7bb5]/5">
                    Próxima
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            <BlogSearch />

            <div id="categorias" className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#4072b0] mb-4">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog/categoria/marketing-digital"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  Marketing Digital
                </Link>
                <Link
                  href="/blog/categoria/seo"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  SEO
                </Link>
                <Link
                  href="/blog/categoria/redes-sociais"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  Redes Sociais
                </Link>
                <Link
                  href="/blog/categoria/analise-de-dados"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  Análise de Dados
                </Link>
                <Link
                  href="/blog/categoria/email-marketing"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  E-mail Marketing
                </Link>
                <Link
                  href="/blog/categoria/tendencias"
                  className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  Tendências
                </Link>
                <Link
                  href="/blog/categorias"
                  className="px-3 py-1.5 bg-[#4b7bb5]/5 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
                >
                  Ver todas
                </Link>
              </div>
            </div>

            {/* Posts populares */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#4072b0] mb-4">Posts Populares</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start space-x-3 group">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img
                        src={post.coverImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2 group-hover:underline"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{post.readTime} de leitura</span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="relative overflow-hidden rounded-lg shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] opacity-90"></div>
              <div className="absolute inset-0 opacity-10">
                <img src="/pattern-bg.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Inscreva-se na Newsletter</h3>
                <p className="text-sm mb-4 text-white/90">
                  Receba nossos conteúdos exclusivos diretamente no seu e-mail.
                </p>
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

            {/* Anúncio ou CTA */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 text-center">
              <h3 className="text-lg font-bold text-[#4072b0] mb-2">Precisa de ajuda com marketing?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nossa equipe de especialistas está pronta para ajudar sua empresa a crescer.
              </p>
              <Link href="/contato">
                <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] w-full">Fale com um especialista</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
