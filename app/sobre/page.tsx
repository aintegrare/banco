import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Clock, Heart, Target, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#3d649e] to-[#4b7bb5]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Sobre a Integrare
                </h1>
                <p className="max-w-[600px] text-white md:text-xl">
                  Conheça nossa história, valores e a equipe por trás da Integrare
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=550&width=550&query=marketing%20team%20meeting"
                width={550}
                height={550}
                alt="Equipe Integrare"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=550&width=550&query=startup%20growth%20journey"
                width={550}
                height={550}
                alt="História da Integrare"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#3d649e]">Nossa História</h2>
                <p className="text-gray-600 md:text-xl/relaxed">
                  Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em
                  evidências científicas e casos práticos de sucesso. Começamos oferecendo serviços simples de gestão de
                  social media e hoje oferecemos um ecossistema completo de serviços de marketing, que inclui todos os
                  aspectos dos negócios digitais das empresas.
                </p>
                <p className="text-gray-600 md:text-xl/relaxed mt-4">
                  Ao longo dos anos, expandimos nossa equipe e serviços, sempre mantendo o compromisso com a excelência
                  e resultados mensuráveis para nossos clientes. Nossa jornada é marcada por parcerias de sucesso e
                  cases que demonstram o poder do marketing estratégico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Filosofia */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f2f1ef]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#3d649e]">Nossa Filosofia</h2>
                <p className="text-gray-600 md:text-xl/relaxed">
                  Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque nosso
                  compromisso é com os resultados que entregamos. Marketing não é sobre vender mais, é sobre ter
                  propósito e mostrar isso para o mundo. É uma ferramenta de reafirmação do porquê viemos e para que
                  estamos aqui.
                </p>
                <p className="text-gray-600 md:text-xl/relaxed mt-4">
                  Acreditamos que o marketing de qualidade deve ser acessível a empresas de todos os tamanhos. Nossa
                  abordagem é baseada em dados, transparência e colaboração contínua com nossos clientes para alcançar
                  resultados excepcionais.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=550&width=550&query=business%20philosophy%20purpose"
                width={550}
                height={550}
                alt="Filosofia da Integrare"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Visão */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=550&width=550&query=business%20vision%20future"
                width={550}
                height={550}
                alt="Visão da Integrare"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#3d649e]">Nossa Visão</h2>
                <p className="text-gray-600 md:text-xl/relaxed">
                  Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos
                  nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes. Nosso objetivo é que
                  nosso cliente tenha confiança e nosso concorrente ansiedade quando pensa em marketing.
                </p>
                <p className="text-gray-600 md:text-xl/relaxed mt-4">
                  Buscamos ser reconhecidos como a agência de marketing mais inovadora e eficaz do mercado,
                  estabelecendo novos padrões de qualidade e resultados para nossos clientes. Queremos transformar a
                  percepção do marketing no Brasil, demonstrando seu verdadeiro potencial quando executado com
                  estratégia e propósito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f2f1ef]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3d649e]">
                Nossos Valores
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Os princípios que guiam nossas ações e decisões todos os dias
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <Target className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Resultados</h3>
              <p className="text-center text-gray-600">
                Focamos em entregar resultados mensuráveis e impactantes para nossos clientes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <Award className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Excelência</h3>
              <p className="text-center text-gray-600">
                Buscamos a excelência em tudo o que fazemos, desde o atendimento até a entrega final.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <Users className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Colaboração</h3>
              <p className="text-center text-gray-600">
                Trabalhamos em parceria com nossos clientes, entendendo seus desafios e objetivos.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <Heart className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Paixão</h3>
              <p className="text-center text-gray-600">
                Amamos o que fazemos e isso se reflete na qualidade do nosso trabalho.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <Clock className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Pontualidade</h3>
              <p className="text-center text-gray-600">
                Respeitamos prazos e compromissos, valorizando o tempo dos nossos clientes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <div className="rounded-full bg-[#4b7bb5]/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#4b7bb5]"
                >
                  <path d="M2 12h20"></path>
                  <path d="M12 2v20"></path>
                  <path d="m4.93 4.93 14.14 14.14"></path>
                  <path d="m19.07 4.93-14.14 14.14"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3d649e]">Inovação</h3>
              <p className="text-center text-gray-600">
                Buscamos constantemente novas soluções e abordagens para os desafios de marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3d649e]">
                Nossa Equipe
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conheça os profissionais talentosos por trás da Integrare
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20marketing%20director"
                  alt="CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Ana Silva</h3>
                <p className="text-gray-600">CEO & Fundadora</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20marketing%20strategist"
                  alt="Diretor de Marketing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Carlos Mendes</h3>
                <p className="text-gray-600">Diretor de Marketing</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20creative%20director"
                  alt="Diretora Criativa"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Mariana Costa</h3>
                <p className="text-gray-600">Diretora Criativa</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20data%20analyst"
                  alt="Analista de Dados"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Pedro Alves</h3>
                <p className="text-gray-600">Analista de Dados</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20content%20manager"
                  alt="Gerente de Conteúdo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Juliana Martins</h3>
                <p className="text-gray-600">Gerente de Conteúdo</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=256&width=256&query=professional%20social%20media%20manager"
                  alt="Gerente de Social Media"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#3d649e]">Rafael Souza</h3>
                <p className="text-gray-600">Gerente de Social Media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#4b7bb5]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Pronto para transformar seu marketing?
              </h2>
              <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Entre em contato conosco hoje mesmo e descubra como podemos ajudar seu negócio a crescer.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contato">
                <Button className="bg-white text-[#4b7bb5] hover:bg-[#f2f1ef]">
                  Fale Conosco <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
