"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Lightbulb,
  Handshake,
  Shield,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  Brain,
  Workflow,
  Linkedin,
  Instagram,
  Menu,
  BarChart,
  Target,
  Users,
  MessageSquare,
} from "lucide-react"
import { MobileMenu } from "@/components/mobile-menu"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Detectar quando a página é rolada
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Verificar posição inicial
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-black/60 header-height transition-all duration-300 ${
          isScrolled ? "bg-black/95" : "bg-transparent border-transparent"
        }`}
      >
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Usando o componente Image com onError para debug */}
            {isScrolled ? (
              <img
                src="/logo-integrare-new.png"
                alt="Agência Integrare"
                className="h-10 w-auto transition-opacity duration-300"
              />
            ) : (
              <img
                src="/logo-integrare-white.png"
                alt="Agência Integrare"
                className="h-10 w-auto transition-opacity duration-300"
              />
            )}
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#servicos" className="text-sm font-medium text-white hover:text-[#4b7bb5]">
              Serviços
            </Link>
            <Link href="#sobre" className="text-sm font-medium text-white hover:text-[#4b7bb5]">
              Por que nós
            </Link>
            <Link href="#processo" className="text-sm font-medium text-white hover:text-[#4b7bb5]">
              Processo
            </Link>
            <Link href="#clientes" className="text-sm font-medium text-white hover:text-[#4b7bb5]">
              Clientes
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://calendly.com/integrare/consultoria"
              className="rounded-md bg-[#4b7bb5] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]/50"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agende uma Consultoria Grátis
            </Link>
          </div>
          <button className="md:hidden text-white p-2" aria-label="Toggle menu" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black text-white py-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-background-cloud.jpg"
              alt="Marketing Digital"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          </div>
          <div className="container relative z-10 hero-container">
            <div className="mx-auto max-w-3xl text-center py-16 md:py-20">
              <div className="animate-fade-in-up compact-spacing">
                <h1 className="mb-4 font-bold tracking-tight">Marketing que entrega resultados reais.</h1>
                <p className="mb-6 text-lg md:text-xl italic">
                  Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em
                  evidências científicas e casos práticos de sucesso.
                </p>
                <div className="flex justify-center mb-6">
                  <Link
                    href="https://calendly.com/integrare/consultoria"
                    className="inline-flex items-center justify-center rounded-md bg-[#4b7bb5] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]/50 hover:translate-y-[-2px] transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agende uma Consultoria Grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <p className="text-sm uppercase tracking-wider">Seu negócio, nosso compromisso.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points / Opportunity Section */}
        <section className="bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center section-title">
              <h2 className="mb-3 font-bold tracking-tight">Marketing não deveria ser um jogo de adivinhação</h2>
              <p className="text-lg text-gray-700">
                Entendemos os desafios únicos que as empresas enfrentam no cenário digital atual.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Gestão de Mídias Sociais</h3>
                <p className="text-gray-700">
                  Criação estratégica de conteúdo e gestão de comunidades para construir a presença da sua marca e
                  engajar seu público.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Publicidade Digital</h3>
                <p className="text-gray-700">
                  Campanhas orientadas por dados que atingem o público certo no momento certo, maximizando seu ROI.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Marketing de Conteúdo</h3>
                <p className="text-gray-700">
                  Conteúdo convincente que estabelece sua autoridade e constrói confiança com seus clientes e
                  concorrentes.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">
                  <Workflow className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Ecossistema Completo de Marketing</h3>
                <p className="text-gray-700">
                  Soluções integradas que cobrem todos os aspectos da presença digital e estratégia de marketing do seu
                  negócio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="servicos" className="bg-gray-50">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center section-title">
              <h2 className="mb-3 font-bold tracking-tight">Nossos Serviços</h2>
              <p className="text-lg text-gray-700">
                Adaptamos nossa abordagem para atender às necessidades do seu negócio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Planejamento Estratégico de Marketing</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Análise abrangente de mercado e pesquisa de concorrentes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Posicionamento de marca e estratégia de mensagens</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Identificação e segmentação de público-alvo</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Definição de objetivos de marketing e KPIs</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Implementação de Marketing Digital</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Gestão de mídias sociais e criação de conteúdo</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Campanhas de SEO e SEM para gerar tráfego qualificado</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Email marketing e estratégias de nutrição de leads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
                    <span>Análise e relatórios de desempenho</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="sobre" className="bg-black text-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center section-title">
              <h2 className="mb-3 font-bold tracking-tight">Por que a Integrare?</h2>
              <p className="text-lg text-gray-300">
                Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque nosso
                compromisso é com os resultados que entregamos.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[#4b7bb5] mb-1">3+</div>
                <p className="text-gray-300">Anos de experiência</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[#4b7bb5] mb-1">50+</div>
                <p className="text-gray-300">Clientes satisfeitos</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[#4b7bb5] mb-1">3</div>
                <p className="text-gray-300">Países com clientes ativos</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Inovação</h3>
                <p className="text-gray-300">
                  Mantemo-nos à frente das tendências e tecnologias para dar ao seu negócio uma vantagem competitiva.
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Handshake className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Parceria</h3>
                <p className="text-gray-300">
                  Trabalhamos como uma extensão da sua equipe, compartilhando objetivos e celebrando conquistas juntos.
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Integridade</h3>
                <p className="text-gray-300">Transparência e honestidade estão no centro de tudo o que fazemos.</p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Excelência</h3>
                <p className="text-gray-300">
                  Entregamos trabalho de alta qualidade que supera expectativas e gera resultados reais.
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Empatia</h3>
                <p className="text-gray-300">
                  Entendemos seus desafios e trabalhamos colaborativamente para encontrar soluções.
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4b7bb5] text-white">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Propósito</h3>
                <p className="text-gray-300">
                  Marketing não é sobre vender mais, é sobre ter propósito e mostrar isso para o mundo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section id="processo" className="bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center section-title">
              <h2 className="mb-3 font-bold tracking-tight">Nosso Processo</h2>
              <p className="text-lg text-gray-700">Uma abordagem comprovada para entregar sucesso em marketing.</p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gray-200 hidden md:block"></div>

              <div className="grid gap-8 md:grid-cols-4">
                <div className="relative flex flex-col items-center text-center">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white mb-3">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Analisar</h3>
                  <p className="text-gray-700">
                    Mergulhamos profundamente em seu negócio, mercado e concorrentes para identificar oportunidades.
                  </p>
                </div>

                <div className="relative flex flex-col items-center text-center">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white mb-3">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Estrategizar</h3>
                  <p className="text-gray-700">
                    Desenvolvemos uma estratégia de marketing personalizada alinhada com seus objetivos de negócio.
                  </p>
                </div>

                <div className="relative flex flex-col items-center text-center">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white mb-3">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Implementar</h3>
                  <p className="text-gray-700">
                    Executamos a estratégia com precisão, criatividade e atenção aos detalhes.
                  </p>
                </div>

                <div className="relative flex flex-col items-center text-center">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#4b7bb5] text-white mb-3">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Otimizar</h3>
                  <p className="text-gray-700">
                    Monitoramos, analisamos e refinamos continuamente para maximizar resultados e ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section id="clientes" className="bg-gray-50">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center section-title">
              <h2 className="mb-3 font-bold tracking-tight">Confiado por Empresas Como a Sua</h2>
              <p className="text-lg text-gray-700">Veja o que nossos clientes têm a dizer sobre trabalhar conosco.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-10">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md">
                <div className="mb-3 text-[#4b7bb5]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3 italic text-gray-700">
                  "A Integrare transformou nossa presença digital. Sua abordagem estratégica para mídias sociais e
                  marketing de conteúdo aumentou significativamente nossa conscientização de marca e geração de leads."
                </p>
                <div>
                  <p className="font-semibold">Carlos</p>
                  <p className="text-sm text-gray-600">Diretor de Marketing, Empresa de Tecnologia</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md">
                <div className="mb-3 text-[#4b7bb5]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3 italic text-gray-700">
                  "Trabalhar com a Integrare foi um divisor de águas para nosso negócio. Sua abordagem orientada por
                  dados para marketing nos ajudou a alcançar o público certo e converter mais leads em clientes."
                </p>
                <div>
                  <p className="font-semibold">Ana</p>
                  <p className="text-sm text-gray-600">CEO, Negócio de E-commerce</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md">
                <div className="mb-3 text-[#4b7bb5]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3 italic text-gray-700">
                  "A equipe da Integrare realmente entende nosso negócio e nossos objetivos. Eles se tornaram uma
                  extensão da nossa equipe, e sua expertise em marketing tem sido inestimável para nosso crescimento."
                </p>
                <div>
                  <p className="font-semibold">Pedro</p>
                  <p className="text-sm text-gray-600">Fundador, Empresa de Serviços</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA Banner */}
        <section className="bg-[#4b7bb5] py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Pronto para transformar seu marketing?
              </h2>
              <p className="mb-6 text-lg">Vamos trabalhar juntos para alcançar os objetivos do seu negócio.</p>
              <Link
                href="https://calendly.com/integrare/consultoria"
                className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agende uma Consultoria Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contato" className="bg-black text-white py-10">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <img src="/logo-integrare-white.png" alt="Agência Integrare" className="h-10 w-auto mb-4" />
              <p className="text-gray-400 mb-4 max-w-md">
                Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos
                nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes.
              </p>
              <p className="text-sm uppercase tracking-wider">Seu negócio, nosso compromisso.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Contate-nos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>BR: +55 11 9999-9999</li>
                <li>contato@integrare.com.br</li>
                <li>Sede: São Paulo, Brasil</li>
                <li className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/company/agencia-integrare/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/agenciaintegrare/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Agência Integrare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
