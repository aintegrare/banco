import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogSearch } from "@/components/blog/blog-search"

export const metadata: Metadata = {
  title: "Resultados da Busca | Blog Integrare",
  description: "Resultados da sua busca no blog da Integrare",
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
    coverImage: "/placeholder.svg?key=qqlo0",
    author: {
      name: "Juliana Costa",
      avatar: "/professional-woman-profile.png",
    },
    category: "Redes Sociais",
    publishedAt: "2023-11-10T09:15:00Z",
    readTime: "6 min",
    featured: false,
  },
]

export default function BlogSearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || ""

  // Simulação de resultados de busca
  const searchResults = query
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title={`Resultados para "${query}"`}
        description={`${searchResults.length} posts encontrados`}
        actions={
          <Link href="/blog">
            <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Blog
            </Button>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-bold text-[#4072b0] mb-4">Nenhum resultado encontrado</h2>
                <p className="text-gray-600 mb-6">Não encontramos posts que correspondam à sua busca por "{query}".</p>
                <p className="text-gray-600 mb-6">Tente usar termos diferentes ou navegue pelas categorias.</p>
                <Link href="/blog">
                  <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Ver Todos os Posts</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            <BlogSearch />
            <BlogCategories />

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
