import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  BarChart,
  MessageSquare,
  Search,
  Globe,
  PenTool,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f1ef]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#4072b0]">Integrare</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#sobre" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Sobre
            </Link>
            <Link href="#servicos" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Serviços
            </Link>
            <Link href="#cases" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Cases
            </Link>
            <Link href="#depoimentos" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Depoimentos
            </Link>
            <Link href="#contato" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Contato
            </Link>
            <Link href="/blog" className="text-[#4b7bb5] hover:text-[#3d649e]">
              Blog
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/search">
              <Button variant="outline" size="sm" className="text-[#4b7bb5] border-[#4b7bb5]">
                <Search className="h-4 w-4 mr-2" />
                Busca
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">
                Área do Cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#4b7bb5] to-[#3d649e] text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketing de Qualidade Baseado em Evidências</h1>
            <p className="text-xl mb-8">
              Transformamos negócios através de estratégias de marketing eficientes e mensuráveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contato">
                <Button size="lg" className="bg-white text-[#4b7bb5] hover:bg-gray-100">
                  Fale Conosco
                </Button>
              </Link>
              <Link href="#servicos">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Nossos Serviços
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80">
              <Image
                src="/digital-marketing-team.png"
                alt="Equipe de marketing digital trabalhando"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4072b0] mb-4">Sobre Nós</h2>
            <p className="text-[#527eb7] max-w-2xl mx-auto">
              Conheça nossa história, filosofia e visão para o futuro do marketing digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#4072b0] mb-4">Nossa História</h3>
              <p className="text-gray-700 mb-4">
                Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em evidências
                científicas e casos práticos de sucesso. Começamos oferecendo serviços simples de gestão de social media
                e hoje oferecemos um ecossistema completo de serviços de marketing, que inclui todos os aspectos dos
                negócios digitais das empresas.
              </p>
              <h3 className="text-2xl font-bold text-[#4072b0] mb-4 mt-8">Nossa Filosofia</h3>
              <p className="text-gray-700 mb-4">
                Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque nosso
                compromisso é com os resultados que entregamos. Marketing não é sobre vender mais, é sobre ter propósito
                e mostrar isso para o mundo. É uma ferramenta de reafirmação do porquê viemos e para que estamos aqui.
              </p>
              <h3 className="text-2xl font-bold text-[#4072b0] mb-4 mt-8">Nossa Visão</h3>
              <p className="text-gray-700">
                Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos
                nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes. Nosso objetivo é que nosso
                cliente tenha confiança e nosso concorrente ansiedade quando pensa em nós.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-96">
                <Image
                  src="/marketing-agency-team.png"
                  alt="Equipe da Integrare em reunião"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-[#f2f1ef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4072b0] mb-4">Nossos Serviços</h2>
            <p className="text-[#527eb7] max-w-2xl mx-auto">
              Oferecemos um ecossistema completo de serviços de marketing digital para impulsionar seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Marketing Digital",
                description:
                  "Estratégias completas de presença digital, SEO, SEM e análise de dados para maximizar seus resultados online.",
              },
              {
                icon: <PenTool className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Criação de Conteúdo",
                description:
                  "Produção de conteúdo relevante e estratégico para blogs, redes sociais e materiais institucionais.",
              },
              {
                icon: <BarChart className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Análise de Dados",
                description:
                  "Monitoramento e análise de métricas para otimizar campanhas e maximizar o retorno sobre investimento.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Gestão de Redes Sociais",
                description: "Criação de estratégias, produção de conteúdo e gestão completa das suas redes sociais.",
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Tráfego Pago",
                description:
                  "Campanhas de anúncios no Google, Facebook, Instagram e outras plataformas para gerar leads qualificados.",
              },
              {
                icon: <Users className="h-10 w-10 text-[#4b7bb5]" />,
                title: "Consultoria Estratégica",
                description:
                  "Análise do seu negócio e desenvolvimento de estratégias personalizadas para alcançar seus objetivos.",
              },
            ].map((service, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-[#4072b0] mb-2">{service.title}</h3>
                  <p className="text-gray-700">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cases de Sucesso */}
      <section id="cases" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4072b0] mb-4">Cases de Sucesso</h2>
            <p className="text-[#527eb7] max-w-2xl mx-auto">
              Conheça alguns dos resultados que alcançamos para nossos clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Aumento de 300% em Leads",
                client: "E-commerce de Moda",
                description:
                  "Implementamos uma estratégia completa de marketing digital que resultou em um aumento de 300% na geração de leads qualificados em apenas 3 meses.",
                metrics: ["300% mais leads", "45% redução no CAC", "89% aumento em vendas"],
              },
              {
                title: "Crescimento de 200% em Seguidores",
                client: "Clínica de Estética",
                description:
                  "Desenvolvemos uma estratégia de conteúdo para redes sociais que resultou em um crescimento de 200% na base de seguidores e 150% no engajamento.",
                metrics: ["200% mais seguidores", "150% mais engajamento", "78% aumento em agendamentos"],
              },
              {
                title: "ROI de 500% em Campanhas",
                client: "Empresa de Tecnologia",
                description:
                  "Criamos campanhas de tráfego pago altamente segmentadas que geraram um ROI de 500% e reduziram o custo por aquisição em 60%.",
                metrics: ["500% ROI", "60% redução no CPA", "320% aumento em conversões"],
              },
            ].map((caseStudy, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#4072b0] mb-1">{caseStudy.title}</h3>
                  <p className="text-[#527eb7] mb-4">{caseStudy.client}</p>
                  <p className="text-gray-700 mb-4">{caseStudy.description}</p>
                  <div className="space-y-2">
                    {caseStudy.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-[#f2f1ef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4072b0] mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-[#527eb7] max-w-2xl mx-auto">
              Veja o que nossos clientes têm a dizer sobre nossa parceria e resultados alcançados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Silva",
                company: "Moda Express",
                testimonial:
                  "A Integrare transformou completamente nossa presença digital. Em apenas 6 meses, vimos um aumento significativo nas vendas e no reconhecimento da marca.",
                image: "/woman-profile.png",
              },
              {
                name: "Carlos Mendes",
                company: "Tech Solutions",
                testimonial:
                  "O que mais me impressiona na Integrare é o compromisso com resultados. Eles realmente tratam nosso negócio como se fosse deles e isso faz toda a diferença.",
                image: "/man-profile.png",
              },
              {
                name: "Juliana Costa",
                company: "Clínica Bem Estar",
                testimonial:
                  "Desde que começamos a trabalhar com a Integrare, nossa agenda está sempre cheia. A estratégia de marketing digital deles é simplesmente excepcional.",
                image: "/professional-woman-profile.png",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4072b0]">{testimonial.name}</h3>
                      <p className="text-sm text-[#527eb7]">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4072b0] mb-4">Entre em Contato</h2>
            <p className="text-[#527eb7] max-w-2xl mx-auto">
              Estamos prontos para ajudar seu negócio a alcançar novos patamares. Entre em contato conosco.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[#4072b0] mb-6">Informações de Contato</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-[#4b7bb5] mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-700">contato@redeintegrare.com.br</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-[#4b7bb5] mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <p className="text-gray-700">(11) 99999-9999</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-[#4b7bb5] mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Endereço</h4>
                    <p className="text-gray-700">São Paulo, SP - Brasil</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#4072b0] mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-[#4b7bb5] text-white p-2 rounded-full hover:bg-[#3d649e] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="bg-[#4b7bb5] text-white p-2 rounded-full hover:bg-[#3d649e] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="bg-[#4b7bb5] text-white p-2 rounded-full hover:bg-[#3d649e] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="bg-[#4b7bb5] text-white p-2 rounded-full hover:bg-[#3d649e] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4072b0] mb-6">Envie uma Mensagem</h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                    placeholder="Sua mensagem"
                  ></textarea>
                </div>

                <div>
                  <Button className="w-full bg-[#4b7bb5] hover:bg-[#3d649e] text-white">Enviar Mensagem</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4b7bb5] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Integrare</h3>
              <p className="mb-4">
                Agência de marketing digital especializada em estratégias baseadas em evidências para impulsionar seu
                negócio.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#sobre" className="hover:underline">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#servicos" className="hover:underline">
                    Serviços
                  </Link>
                </li>
                <li>
                  <Link href="#cases" className="hover:underline">
                    Cases
                  </Link>
                </li>
                <li>
                  <Link href="#depoimentos" className="hover:underline">
                    Depoimentos
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="hover:underline">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Serviços</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Marketing Digital
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Criação de Conteúdo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Gestão de Redes Sociais
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Tráfego Pago
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Consultoria Estratégica
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contato@redeintegrare.com.br</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>São Paulo, SP - Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
