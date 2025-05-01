import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Simulação de dados de blog posts
const blogPosts = [
  {
    id: 1,
    title: "Como criar uma estratégia de marketing digital eficaz",
    excerpt:
      "Descubra as melhores práticas para desenvolver uma estratégia de marketing digital que realmente funciona para o seu negócio.",
    image: "/digital-marketing-strategy.png",
    date: "10 de Maio, 2023",
    author: "Ana Silva",
    readTime: "5 min de leitura",
    category: "Marketing Digital",
    slug: "como-criar-estrategia-marketing-digital-eficaz",
  },
  {
    id: 2,
    title: "O poder das redes sociais para pequenas empresas",
    excerpt:
      "Entenda como as redes sociais podem ser uma ferramenta poderosa para pequenas empresas conquistarem seu espaço no mercado.",
    image: "/social-media-small-business.png",
    date: "25 de Abril, 2023",
    author: "Carlos Mendes",
    readTime: "7 min de leitura",
    category: "Social Media",
    slug: "poder-redes-sociais-pequenas-empresas",
  },
  {
    id: 3,
    title: "Análise de dados: transformando números em insights",
    excerpt:
      "Como utilizar a análise de dados para obter insights valiosos e tomar decisões mais assertivas em seu negócio.",
    image: "/data-analysis-business.png",
    date: "15 de Abril, 2023",
    author: "Mariana Costa",
    readTime: "6 min de leitura",
    category: "Análise de Dados",
    slug: "analise-dados-transformando-numeros-insights",
  },
  {
    id: 4,
    title: "Tendências de marketing para 2023",
    excerpt: "Conheça as principais tendências de marketing que prometem revolucionar o mercado em 2023.",
    image: "/placeholder.svg?height=400&width=600&query=marketing%20trends%202023",
    date: "5 de Abril, 2023",
    author: "Pedro Alves",
    readTime: "8 min de leitura",
    category: "Tendências",
    slug: "tendencias-marketing-2023",
  },
  {
    id: 5,
    title: "Como criar conteúdo que engaja e converte",
    excerpt:
      "Estratégias práticas para criar conteúdo relevante que não apenas engaja seu público, mas também o converte em cliente.",
    image: "/placeholder.svg?height=400&width=600&query=content%20marketing%20engagement",
    date: "28 de Março, 2023",
    author: "Juliana Martins",
    readTime: "6 min de leitura",
    category: "Criação de Conteúdo",
    slug: "como-criar-conteudo-engaja-converte",
  },
  {
    id: 6,
    title: "SEO: como melhorar o posicionamento do seu site nos buscadores",
    excerpt: "Dicas práticas para otimizar seu site e melhorar seu posicionamento nos resultados de busca do Google.",
    image: "/placeholder.svg?height=400&width=600&query=seo%20optimization",
    date: "15 de Março, 2023",
    author: "Rafael Souza",
    readTime: "9 min de leitura",
    category: "SEO",
    slug: "seo-melhorar-posicionamento-site-buscadores",
  },
]

// Categorias para filtro
const categories = [
  "Todos",
  "Marketing Digital",
  "Social Media",
  "Análise de Dados",
  "Tendências",
  "Criação de Conteúdo",
  "SEO",
]

export default function BlogPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3d649e]">
          Blog da Integrare
        </h1>
        <p className="mt-4 text-gray-600 md:text-xl">
          Insights, dicas e tendências sobre marketing digital para o seu negócio
        </p>
      </div>

      {/* Categorias */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={index === 0 ? "default" : "outline"}
            className={index === 0 ? "bg-[#4b7bb5] hover:bg-[#3d649e]" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Posts em destaque */}
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-[#4b7bb5]">Posts em Destaque</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="inline-block rounded-full bg-[#4b7bb5]/10 px-2 py-1 text-xs font-medium text-[#4b7bb5]">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-xl text-[#3d649e]">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                    Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Todos os posts */}
      <div>
        <h2 className="mb-8 text-2xl font-bold text-[#4b7bb5]">Todos os Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="inline-block rounded-full bg-[#4b7bb5]/10 px-2 py-1 text-xs font-medium text-[#4b7bb5]">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-xl text-[#3d649e]">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                    Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Anterior
          </Button>
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Próximo</Button>
        </div>
      </div>
    </div>
  )
}
