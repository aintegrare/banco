import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Ultra minimalista */}
      <section className="w-full bg-white py-24 md:py-32 lg:py-40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
                Marketing baseado em <span className="text-[#3d649e]">resultados</span>
              </h1>
              <p className="text-xl text-gray-600">
                Transformamos sua presença digital com estratégias baseadas em evidências científicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contato">
                  <Button className="bg-[#3d649e] hover:bg-[#4b7bb5] text-white text-lg px-8 py-6 h-auto rounded-md">
                    Fale Conosco
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] w-full rounded-md overflow-hidden">
                <Image
                  src="/marketing-team-blue.png"
                  alt="Integrare Marketing"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços - Ultra minimalista */}
      <section className="w-full py-24 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">
            Nossos Serviços
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-md">
              <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Marketing Digital</h3>
              <p className="text-gray-600 mb-6">
                Estratégias completas para aumentar sua presença online e gerar resultados mensuráveis.
              </p>
            </div>

            <div className="bg-white p-8 rounded-md">
              <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Social Media</h3>
              <p className="text-gray-600 mb-6">
                Gestão profissional de redes sociais para engajar seu público e fortalecer sua marca.
              </p>
            </div>

            <div className="bg-white p-8 rounded-md">
              <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Análise de Dados</h3>
              <p className="text-gray-600 mb-6">
                Insights baseados em dados para otimizar suas estratégias e maximizar resultados.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <Link href="/servicos">
              <Button className="bg-[#3d649e] hover:bg-[#4b7bb5] text-white text-lg px-8 py-6 h-auto rounded-md">
                Ver todos os serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre - Ultra minimalista */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[500px] w-full rounded-md overflow-hidden">
                <Image src="/marketing-team-collaboration.png" fill alt="Equipe Integrare" className="object-cover" />
              </div>
            </div>
            <div className="flex flex-col space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Nossa História</h2>
              <p className="text-xl text-gray-600">
                Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em evidências
                científicas e casos práticos de sucesso.
              </p>
              <Link href="/sobre">
                <Button className="bg-[#3d649e] hover:bg-[#4b7bb5] text-white text-lg px-8 py-6 h-auto rounded-md self-start">
                  Conheça mais sobre nós
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos - Ultra minimalista */}
      <section className="w-full py-24 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">
            Projetos em Destaque
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-md overflow-hidden">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src="/digital-marketing-campaign-tech.png" alt="Projeto 1" fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Campanha Digital para Empresa de Tecnologia</h3>
              </div>
            </div>

            <div className="bg-white rounded-md overflow-hidden">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src="/restaurant-branding.png" alt="Projeto 2" fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Rebranding para Rede de Restaurantes</h3>
              </div>
            </div>

            <div className="bg-white rounded-md overflow-hidden">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src="/content-strategy-ecommerce.png" alt="Projeto 3" fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#3d649e] mb-4">Estratégia de Conteúdo para E-commerce</h3>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <Link href="/portfolio">
              <Button className="bg-[#3d649e] hover:bg-[#4b7bb5] text-white text-lg px-8 py-6 h-auto rounded-md">
                Ver todos os projetos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Ultra minimalista */}
      <section className="w-full py-24 md:py-32 bg-[#3d649e]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              Pronto para transformar seu marketing?
            </h2>
            <Link href="/contato">
              <Button className="bg-white text-[#3d649e] hover:bg-gray-100 text-lg px-8 py-6 h-auto rounded-md">
                Fale Conosco <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
