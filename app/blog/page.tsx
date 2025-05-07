import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    coverImage: "/placeholder.svg?key=i7ig0",
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
    coverImage: "/placeholder.svg?key=bobx7",
    author: {
      name: "Fernanda Lima",
      avatar: "/placeholder.svg?key=hs3j9",
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
    coverImage: "/placeholder.svg?key=7567c",
    author: {
      name: "Paulo Santos",
      avatar: "/placeholder.svg?key=8i98z",
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

// Categorias populares
const popularCategories = [
  { name: "Marketing Digital", count: 12 },
  { name: "SEO", count: 8 },
  { name: "Redes Sociais", count: 15 },
  { name: "E-mail Marketing", count: 6 },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef] p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#4b7bb5]">Blog da Integrare</h1>
      <p className="mb-6">Conteúdos sobre marketing, negócios e tecnologia</p>

      <Link href="/blog/admin">
        <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Acessar Administração</Button>
      </Link>

      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <p>Conteúdo da página principal do blog</p>
      </div>
    </div>
  )
}
