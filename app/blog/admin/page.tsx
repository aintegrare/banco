import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Dados de exemplo para os posts do blog
const blogPosts = [
  {
    id: "1",
    title: "Como o Marketing Digital Transformou os Negócios em 2023",
    slug: "como-o-marketing-digital-transformou-os-negocios-em-2023",
    excerpt:
      "Descubra as principais tendências de marketing digital que impactaram os negócios no último ano e como se preparar para o futuro.",
    status: "Publicado",
    category: "Marketing Digital",
    publishedAt: "2023-12-15T10:00:00Z",
    author: {
      name: "Ana Silva",
    },
    views: 1245,
    comments: 32,
  },
  {
    id: "2",
    title: "Estratégias de SEO para Pequenas Empresas",
    slug: "estrategias-de-seo-para-pequenas-empresas",
    excerpt:
      "Um guia completo sobre como pequenas empresas podem melhorar seu posicionamento nos mecanismos de busca sem grandes investimentos.",
    status: "Publicado",
    category: "SEO",
    publishedAt: "2023-11-28T14:30:00Z",
    author: {
      name: "Carlos Mendes",
    },
    views: 876,
    comments: 18,
  },
  {
    id: "3",
    title: "O Poder das Redes Sociais para Engajamento de Clientes",
    slug: "o-poder-das-redes-sociais-para-engajamento-de-clientes",
    excerpt:
      "Como utilizar as redes sociais de forma estratégica para aumentar o engajamento e a fidelização de clientes.",
    status: "Publicado",
    category: "Redes Sociais",
    publishedAt: "2023-11-10T09:15:00Z",
    author: {
      name: "Juliana Costa",
    },
    views: 1032,
    comments: 27,
  },
  {
    id: "4",
    title: "Análise de Dados: Como Tomar Decisões Baseadas em Informações",
    slug: "analise-de-dados-como-tomar-decisoes-baseadas-em-informacoes",
    excerpt:
      "A importância da análise de dados para tomada de decisões estratégicas e como implementar uma cultura data-driven na sua empresa.",
    status: "Publicado",
    category: "Análise de Dados",
    publishedAt: "2023-10-25T16:45:00Z",
    author: {
      name: "Ricardo Oliveira",
    },
    views: 654,
    comments: 12,
  },
  {
    id: "5",
    title: "E-mail Marketing: Estratégias que Realmente Funcionam",
    slug: "email-marketing-estrategias-que-realmente-funcionam",
    excerpt:
      "Dicas práticas para criar campanhas de e-mail marketing eficientes que geram conversões e fortalecem o relacionamento com clientes.",
    status: "Rascunho",
    category: "E-mail Marketing",
    publishedAt: null,
    author: {
      name: "Fernanda Lima",
    },
    views: 0,
    comments: 0,
  },
  {
    id: "6",
    title: "Tendências de Marketing para 2024",
    slug: "tendencias-de-marketing-para-2024",
    excerpt:
      "As principais tendências de marketing que devem dominar o mercado em 2024 e como se preparar para aproveitar essas oportunidades.",
    status: "Agendado",
    category: "Tendências",
    publishedAt: "2024-01-05T13:40:00Z",
    author: {
      name: "Paulo Santos",
    },
    views: 0,
    comments: 0,
  },
]

// Estatísticas do blog
const blogStats = {
  totalPosts: 42,
  publishedPosts: 36,
  draftPosts: 4,
  scheduledPosts: 2,
  totalViews: 28750,
  totalComments: 342,
  categories: 8,
  authors: 6,
}

export default function BlogAdminPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef] p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#4b7bb5]">Gerenciar Blog</h1>
      <p className="mb-6">Crie, edite e gerencie os posts do blog da Integrare</p>

      <Link href="/blog/admin/novo">
        <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </Link>

      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <p>Conteúdo da página de administração do blog</p>
      </div>
    </div>
  )
}
