"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart2,
  Target,
  Users,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  Globe,
  MessageSquare,
  PenTool,
  Search,
  ShoppingBag,
  ChevronLeft,
  Quote,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  MoonStar,
  Sun,
  ArrowUp,
  Sparkles,
  Award,
  Zap,
  LineChart,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header isScrolled={isScrolled} />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ResultsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-[#4072b0] text-white shadow-lg hover:bg-[#3d649e] transition-all duration-300 z-50 animate-fade-in"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

// Header Component
function Header({ isScrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const scrollToSection = (id) => {
    closeMenu()
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-white dark:bg-gray-900"}`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
          <span className="text-xl font-bold text-[#3d649e] dark:text-[#6b91c1]">Integrare</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("sobre")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Sobre
          </button>
          <button
            onClick={() => scrollToSection("servicos")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection("resultados")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Resultados
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("contato")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Contato
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonStar className="h-5 w-5 text-[#4072b0]" />
            )}
          </button>

          <Button
            onClick={() => scrollToSection("contato")}
            className="hidden md:flex bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] transition-colors"
          >
            Fale Conosco
          </Button>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            ) : (
              <Menu className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="container py-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
              <span className="text-xl font-bold text-[#3d649e] dark:text-[#6b91c1]">Integrare</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <button
              onClick={() => scrollToSection("sobre")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("resultados")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Resultados
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Contato
            </button>

            <Button
              onClick={() => {
                scrollToSection("contato")
                closeMenu()
              }}
              className="mt-4 bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]"
            >
              Fale Conosco
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Hero Section Component
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] dark:from-[#3d649e] dark:to-[#1e3c64] text-white"
    >
      <div className="absolute inset-0 bg-[url('/abstract-digital-marketing-pattern.png')] opacity-10 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Marketing de Verdade para Resultados Reais
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-lg">
              Chega de promessas vazias. Nosso marketing é baseado em evidências, estratégias comprovadas e resultados
              mensuráveis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-[#3d649e] hover:bg-white/90 dark:bg-white/90 dark:hover:bg-white"
              >
                Conheça Nossa Abordagem
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ver Resultados
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            className={`hidden md:block transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6b91c1] to-[#4072b0] rounded-lg blur-md opacity-75 animate-pulse"></div>
              <img
                src="/marketing-dashboard.png"
                alt="Dashboard de marketing com métricas e resultados"
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

// About Section Component
function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="sobre" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Nossa Filosofia
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Marketing não é sobre vender mais, é sobre ter propósito e mostrar isso para o mundo. É uma ferramenta de
            reafirmação do porquê viemos e para que estamos aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4b7bb5]/30 to-transparent mix-blend-overlay"></div>
              <img
                src="/placeholder.svg?key=14itz"
                alt="Equipe de marketing trabalhando em estratégia"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <h3 className="text-2xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-6">
              O que é Marketing de Verdade?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Marketing de Verdade é baseado em evidências científicas e casos práticos de sucesso. Não trabalhamos com
              promessas vazias ou táticas passageiras, mas com estratégias comprovadas que geram resultados mensuráveis
              e duradouros.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Baseado em Evidências</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Utilizamos dados e pesquisas para fundamentar nossas estratégias.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Foco em Resultados</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Medimos e otimizamos constantemente para maximizar o ROI.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Transparência Total</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Relatórios claros e comunicação aberta em todo o processo.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Estratégia Personalizada</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cada negócio é único e merece uma abordagem sob medida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Services Section Component
function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const services = [
    {
      icon: <Globe className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Marketing Digital",
      description: "Estratégias digitais completas para maximizar sua presença online.",
      features: ["Planejamento estratégico", "Gestão de campanhas", "Análise de métricas", "Otimização contínua"],
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Gestão de Mídias Sociais",
      description: "Construa uma presença forte e engajante nas redes sociais.",
      features: ["Criação de conteúdo", "Calendário editorial", "Gestão de comunidade", "Relatórios de desempenho"],
    },
    {
      icon: <Search className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "SEO e Tráfego Pago",
      description: "Aumente sua visibilidade e atraia visitantes qualificados.",
      features: ["Otimização on-page", "Link building", "Google Ads", "Meta Ads"],
    },
    {
      icon: <PenTool className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Branding e Identidade",
      description: "Desenvolva uma marca forte e memorável que se conecta com seu público.",
      features: ["Desenvolvimento de marca", "Identidade visual", "Posicionamento", "Voz e tom da marca"],
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "E-commerce",
      description: "Estratégias para aumentar vendas e melhorar a experiência de compra.",
      features: ["Otimização de conversão", "Estratégias de preço", "Remarketing", "Automação de marketing"],
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Análise e Relatórios",
      description: "Dados transformados em insights acionáveis para seu negócio.",
      features: [
        "Dashboards personalizados",
        "Análise de concorrência",
        "Relatórios de performance",
        "Recomendações estratégicas",
      ],
    },
  ]

  return (
    <section id="servicos" ref={sectionRef} className="py-20 bg-[#f2f1ef] dark:bg-gray-800 relative">
      <div className="absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto rotate-180">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Nossos Serviços
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Oferecemos um ecossistema completo de serviços de marketing, abrangendo todos os aspectos dos negócios
            digitais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

// Service Card Component
function ServiceCard({ icon, title, description, features }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 ${isHovered ? "transform -translate-y-2" : ""} dark:bg-gray-900 dark:text-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div
          className={`bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full w-fit transition-all duration-300 ${isHovered ? "bg-[#4b7bb5]/20 dark:bg-[#4b7bb5]/30 scale-110" : ""}`}
        >
          {icon}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#4b7bb5] dark:bg-[#6b91c1]"></div>
              <span className="dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full text-[#4072b0] border-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:text-[#6b91c1] dark:border-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
        >
          Saiba Mais
        </Button>
      </CardFooter>
    </Card>
  )
}

// Results Section Component
function ResultsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="resultados" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Resultados Reais
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Não acredite apenas em nossas palavras. Veja o que nossos clientes têm a dizer sobre o impacto do Marketing
            de Verdade em seus negócios.
          </p>
        </div>

        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <TestimonialCarousel />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <StatCard
              icon={<TrendingUp className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+127%"
              description="Aumento médio em conversões"
            />
          </div>
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "400ms" }}
          >
            <StatCard
              icon={<Users className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+85%"
              description="Aumento em engajamento"
            />
          </div>
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "600ms" }}
          >
            <StatCard
              icon={<Target className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+210%"
              description="ROI médio em campanhas"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div
            className={`lg:col-span-1 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#3d649e] dark:text-[#6b91c1]">
                Nosso Compromisso com Resultados
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trabalhamos com métricas claras e objetivas para garantir que cada estratégia implementada gere retorno
                mensurável para o seu negócio.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#4072b0] dark:text-[#6b91c1]" />
                  <span className="text-gray-700 dark:text-gray-300">Análise contínua de performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#4072b0] dark:text-[#6b91c1]" />
                  <span className="text-gray-700 dark:text-gray-300">Benchmarking com concorrentes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-[#4072b0] dark:text-[#6b91c1]" />
                  <span className="text-gray-700 dark:text-gray-300">Otimização baseada em dados</span>
                </div>
                <div className="flex items-center gap-3">
                  <LineChart className="h-5 w-5 text-[#4072b0] dark:text-[#6b91c1]" />
                  <span className="text-gray-700 dark:text-gray-300">Relatórios transparentes</span>
                </div>
              </div>
              <Button className="mt-4 bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]">
                Conheça Nossa Metodologia
              </Button>
            </div>
          </div>
          <div
            className={`lg:col-span-2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4b7bb5]/30 to-transparent mix-blend-overlay"></div>
              <img
                src="/marketing-results-chart.png"
                alt="Gráfico de resultados de marketing"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Stat Card Component
function StatCard({ icon, value, description }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:text-white">
      <CardHeader className="text-center">
        <div className="mx-auto bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full w-fit">{icon}</div>
        <CardTitle className="mt-4 text-3xl text-[#3d649e] dark:text-[#6b91c1]">{value}</CardTitle>
        <CardDescription className="text-base dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

// FAQ Section Component
function FaqSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const faqs = [
    {
      question: "O que diferencia o Marketing de Verdade das abordagens tradicionais?",
      answer:
        "O Marketing de Verdade se diferencia por ser baseado em evidências científicas e casos práticos de sucesso, não em tendências passageiras. Focamos em estratégias comprovadas que geram resultados mensuráveis, com total transparência no processo e relatórios detalhados de performance.",
    },
    {
      question: "Quanto tempo leva para ver resultados com suas estratégias?",
      answer:
        "O tempo para resultados varia conforme o setor, a competitividade do mercado e os objetivos específicos. Geralmente, melhorias iniciais podem ser observadas em 30-60 dias, com resultados mais significativos em 3-6 meses. Estabelecemos expectativas realistas desde o início e fornecemos relatórios de progresso regulares.",
    },
    {
      question: "Como vocês medem o sucesso das campanhas de marketing?",
      answer:
        "Utilizamos KPIs (Indicadores-Chave de Performance) personalizados para cada cliente e objetivo. Isso pode incluir métricas como taxa de conversão, custo por aquisição, ROI, engajamento, tráfego qualificado e posicionamento orgânico. Todos os resultados são apresentados em dashboards transparentes e de fácil compreensão.",
    },
    {
      question: "Vocês trabalham com empresas de qualquer tamanho ou setor?",
      answer:
        "Sim, trabalhamos com empresas de todos os tamanhos, desde startups até grandes corporações. Nossa abordagem é personalizada para atender às necessidades específicas de cada cliente, independentemente do setor. Temos experiência em diversos segmentos, incluindo tecnologia, saúde, educação, varejo, serviços profissionais e muitos outros.",
    },
    {
      question: "Como funciona o processo de onboarding para novos clientes?",
      answer:
        "Nosso processo de onboarding inclui: 1) Reunião inicial para entender seus objetivos e desafios; 2) Análise detalhada do seu mercado, concorrência e presença digital atual; 3) Desenvolvimento de estratégia personalizada; 4) Apresentação do plano com cronograma e métricas de sucesso; 5) Implementação das primeiras ações; 6) Reuniões regulares de acompanhamento e ajustes estratégicos.",
    },
    {
      question: "Quais ferramentas e tecnologias vocês utilizam?",
      answer:
        "Utilizamos um conjunto abrangente de ferramentas de análise, automação e gestão de marketing, incluindo Google Analytics, SEMrush, Ahrefs, HubSpot, Mailchimp, Buffer, Hootsuite, entre outras. Nossa equipe está sempre atualizada com as mais recentes tecnologias e tendências do mercado para garantir resultados superiores.",
    },
  ]

  return (
    <section id="faq" ref={sectionRef} className="py-20 bg-[#f2f1ef] dark:bg-gray-800">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossa abordagem de Marketing de Verdade e como podemos ajudar seu negócio.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${150 * index}ms` }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="text-left font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>

          <div
            className={`mt-10 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Não encontrou a resposta que procurava? Entre em contato conosco.
            </p>
            <Button
              onClick={() => {
                const element = document.getElementById("contato")
                if (element) {
                  const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
                  window.scrollTo({
                    top: offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]"
            >
              Fale Conosco
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonial Carousel Component
function TestimonialCarousel() {
  const testimonials = [
    {
      quote:
        "O Marketing de Verdade transformou completamente nossa abordagem. Pela primeira vez, conseguimos ver resultados reais e mensuráveis em nossas campanhas.",
      author: "Ana Silva",
      position: "CEO, TechSolutions",
      image: "/professional-woman-headshot.png",
    },
    {
      quote:
        "Finalmente encontramos uma abordagem de marketing que não se baseia em promessas vazias. Os resultados falam por si e nossa empresa cresceu 45% no último ano.",
      author: "Carlos Mendes",
      position: "Diretor de Marketing, Inovare",
      image: "/professional-man-headshot.png",
    },
    {
      quote:
        "A transparência e o foco em resultados mensuráveis fizeram toda a diferença. Nossa taxa de conversão aumentou 78% em apenas 6 meses.",
      author: "Mariana Costa",
      position: "Fundadora, EcoVida",
      image: "/young-professional-woman-avatar.png",
    },
  ]

  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((current + 1) % testimonials.length)

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 8000)

    return () => clearInterval(interval)
  }, [current])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="border-none shadow-lg bg-white dark:bg-gray-900 mx-auto max-w-3xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#4b7bb5] to-[#3d649e] rounded-full blur opacity-75"></div>
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="relative w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-800"
                        />
                        <div className="absolute -top-2 -left-2 bg-[#4072b0] dark:bg-[#6b91c1] rounded-full p-1 shadow-md">
                          <Quote className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold text-[#3d649e] dark:text-[#6b91c1]">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="rounded-full border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Anterior</span>
        </Button>
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant={index === current ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrent(index)}
            className={
              index === current
                ? "bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#6b91c1] dark:hover:bg-[#4b7bb5] h-8 w-8 p-0 rounded-full"
                : "border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white h-8 w-8 p-0 rounded-full transition-colors"
            }
          >
            <span className="sr-only">Depoimento {index + 1}</span>
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="rounded-full border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próximo</span>
        </Button>
      </div>
    </div>
  )
}

// Contact Section Component
function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const validateForm = () => {
    const errors = {}

    if (!formState.name.trim()) {
      errors.name = "Nome é obrigatório"
    }

    if (!formState.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email inválido"
    }

    if (!formState.message.trim()) {
      errors.message = "Mensagem é obrigatória"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        company: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <section id="contato" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Entre em Contato
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pronto para transformar seu marketing com estratégias baseadas em resultados? Fale conosco hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card
            className={`lg:col-span-2 border-none shadow-lg dark:bg-gray-900 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <CardHeader>
              <CardTitle className="text-[#3d649e] dark:text-[#6b91c1]">Envie uma mensagem</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Preencha o formulário abaixo e entraremos em contato em até 24 horas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-white">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      value={formState.name}
                      onChange={handleChange}
                      className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${formErrors.name ? "border-red-500 dark:border-red-500" : ""}`}
                    />
                    {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formState.email}
                      onChange={handleChange}
                      className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${formErrors.email ? "border-red-500 dark:border-red-500" : ""}`}
                    />
                    {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="dark:text-white">
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Nome da sua empresa"
                    value={formState.company}
                    onChange={handleChange}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-white">
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${formErrors.message ? "border-red-500 dark:border-red-500" : ""}`}
                  />
                  {formErrors.message && <p className="text-sm text-red-500 mt-1">{formErrors.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Mensagem"
                  )}
                </Button>
                {isSubmitted && (
                  <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <ContactInfoCard
              icon={<Mail className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Email"
              lines={["contato@integrare.com.br", "suporte@integrare.com.br"]}
            />

            <ContactInfoCard
              icon={<Phone className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Telefone"
              lines={["(00) 0000-0000", "(00) 90000-0000"]}
            />

            <ContactInfoCard
              icon={<MapPin className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Endereço"
              lines={["Av. Paulista, 1000", "São Paulo, SP - Brasil"]}
            />

            <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-900">
              <CardContent className="p-0">
                <img
                  src="/placeholder.svg?height=200&width=400&query=sao paulo city map location"
                  alt="Mapa de localização"
                  className="w-full h-[200px] object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Info Card Component
function ContactInfoCard({ icon, title, lines }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:text-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full">{icon}</div>
          <div>
            <h3 className="font-medium text-lg mb-1 text-[#3d649e] dark:text-[#6b91c1]">{title}</h3>
            {lines.map((line, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-400">
                {line}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="border-t bg-[#3d649e] dark:bg-gray-800 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-6 w-6" />
              <span className="text-xl font-bold">Integrare</span>
            </div>
            <p className="text-sm text-white/80 dark:text-white/70">
              Marketing baseado em evidências e resultados reais.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-white transition-colors">
                  Resultados
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Serviços</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li>Marketing Digital</li>
              <li>Gestão de Mídias Sociais</li>
              <li>SEO e Tráfego Pago</li>
              <li>Branding e Identidade</li>
              <li>E-commerce</li>
              <li>Análise e Relatórios</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@integrare.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full">
                Inscreva-se na Newsletter
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60 dark:text-white/50">
          <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
