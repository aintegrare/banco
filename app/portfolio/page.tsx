import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Simulação de dados de projetos
const projects = [
  {
    id: 1,
    title: "Campanha Digital para Empresa de Tecnologia",
    description:
      "Estratégia completa de marketing digital para lançamento de produto, incluindo gestão de redes sociais, criação de conteúdo e campanhas de anúncios.",
    image: "/placeholder.svg?height=600&width=800&query=digital%20marketing%20campaign%20tech",
    category: "Marketing Digital",
    client: "TechSolutions",
    year: "2023",
    slug: "campanha-digital-empresa-tecnologia",
  },
  {
    id: 2,
    title: "Rebranding para Rede de Restaurantes",
    description:
      "Desenvolvimento de nova identidade visual, incluindo logo, materiais impressos e digitais, e estratégia de comunicação para rede de restaurantes.",
    image: "/placeholder.svg?height=600&width=800&query=restaurant%20branding",
    category: "Design Gráfico",
    client: "Sabor & Cia",
    year: "2022",
    slug: "rebranding-rede-restaurantes",
  },
  {
    id: 3,
    title: "Estratégia de Conteúdo para E-commerce",
    description:
      "Criação e implementação de estratégia de conteúdo para blog, redes sociais e email marketing, aumentando o tráfego orgânico em 150%.",
    image: "/placeholder.svg?height=600&width=800&query=content%20strategy%20ecommerce",
    category: "Criação de Conteúdo",
    client: "ModaStore",
    year: "2023",
    slug: "estrategia-conteudo-ecommerce",
  },
  {
    id: 4,
    title: "Campanha de Mídia Paga para Startup",
    description:
      "Gestão de campanhas de mídia paga no Google Ads e Meta Ads, resultando em um ROI de 300% e aumento de 200% nas conversões.",
    image: "/placeholder.svg?height=600&width=800&query=paid%20media%20campaign",
    category: "Marketing Digital",
    client: "InnovateTech",
    year: "2022",
    slug: "campanha-midia-paga-startup",
  },
  {
    id: 5,
    title: "Estratégia de Social Media para Clínica",
    description:
      "Desenvolvimento e implementação de estratégia de social media para clínica médica, aumentando o engajamento em 180% e as consultas em 75%.",
    image: "/placeholder.svg?height=600&width=800&query=social%20media%20healthcare",
    category: "Social Media",
    client: "Clínica Saúde Total",
    year: "2023",
    slug: "estrategia-social-media-clinica",
  },
  {
    id: 6,
    title: "Análise de Dados para Empresa de Varejo",
    description:
      "Implementação de sistema de análise de dados para tomada de decisões, resultando em otimização de estoque e aumento de 25% nas vendas.",
    image: "/placeholder.svg?height=600&width=800&query=data%20analysis%20retail",
    category: "Análise de Dados",
    client: "MegaVarejo",
    year: "2022",
    slug: "analise-dados-empresa-varejo",
  },
]

// Categorias para filtro
const categories = [
  "Todos",
  "Marketing Digital",
  "Social Media",
  "Análise de Dados",
  "Design Gráfico",
  "Criação de Conteúdo",
]

export default function PortfolioPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3d649e]">Nosso Portfólio</h1>
        <p className="mt-4 text-gray-600 md:text-xl">
          Conheça alguns dos projetos que desenvolvemos para nossos clientes
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

      {/* Projetos */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <div className="mb-2">
                <span className="inline-block rounded-full bg-[#4b7bb5]/10 px-2 py-1 text-xs font-medium text-[#4b7bb5]">
                  {project.category}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#3d649e]">{project.title}</h3>
              <p className="mb-4 text-sm text-gray-600">{project.description}</p>
              <div className="mb-4 flex gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Cliente:</span> {project.client}
                </div>
                <div>
                  <span className="font-medium">Ano:</span> {project.year}
                </div>
              </div>
              <Link href={`/portfolio/${project.slug}`}>
                <Button className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]">
                  Ver Projeto <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-lg bg-[#4b7bb5] p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Pronto para transformar seu negócio?</h2>
        <p className="mb-6 text-white/90">
          Entre em contato conosco e descubra como podemos ajudar sua empresa a alcançar resultados extraordinários.
        </p>
        <Link href="/contato">
          <Button className="bg-white text-[#4b7bb5] hover:bg-[#f2f1ef]">
            Fale Conosco <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
