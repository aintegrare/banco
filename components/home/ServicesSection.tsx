"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, MessageSquare, PenTool, BarChart2, TrendingUp, Users } from "lucide-react"
import { ServiceCard } from "@/components/shared/ServiceCard"
import { Button } from "@/components/ui/button"

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      description:
        "Estratégias completas de presença digital, SEO, SEM e análise de dados para maximizar seus resultados online.",
      features: ["Planejamento estratégico", "Gestão de campanhas", "Análise de métricas", "Otimização contínua"],
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Gestão de Redes Sociais",
      description: "Criação de estratégias, produção de conteúdo e gestão completa das suas redes sociais.",
      features: ["Criação de conteúdo", "Calendário editorial", "Gestão de comunidade", "Relatórios de desempenho"],
    },
    {
      icon: <PenTool className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Criação de Conteúdo",
      description: "Produção de conteúdo relevante e estratégico para blogs, redes sociais e materiais institucionais.",
      features: ["Copywriting", "Produção visual", "Storytelling", "Conteúdo para SEO"],
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Análise de Dados",
      description:
        "Monitoramento e análise de métricas para otimizar campanhas e maximizar o retorno sobre investimento.",
      features: [
        "Dashboards personalizados",
        "Análise de concorrência",
        "Relatórios de performance",
        "Insights acionáveis",
      ],
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Tráfego Pago",
      description:
        "Campanhas de anúncios no Google, Facebook, Instagram e outras plataformas para gerar leads qualificados.",
      features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Remarketing"],
    },
    {
      icon: <Users className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />,
      title: "Consultoria Estratégica",
      description:
        "Análise do seu negócio e desenvolvimento de estratégias personalizadas para alcançar seus objetivos.",
      features: ["Diagnóstico de marketing", "Planejamento estratégico", "Mentoria para equipes", "Workshops"],
    },
  ]

  const scrollToSection = (id: string) => {
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
    <section id="servicos" ref={sectionRef} className="py-24 bg-[#f8f7f5] dark:bg-gray-800 relative overflow-hidden">
      {/* Background Elements */}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div
            className={`inline-block py-1 px-3 rounded-full border border-[#4072b0]/20 text-[#4072b0] dark:text-[#6b91c1] text-sm font-medium mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Nossos Serviços
          </div>
          <h2
            className={`text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Soluções de Marketing Completas
          </h2>
          <div
            className={`w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          ></div>
          <p
            className={`mt-4 text-lg text-gray-600 dark:text-gray-300 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Oferecemos um ecossistema completo de serviços de marketing digital para impulsionar seu negócio com
            estratégias personalizadas e resultados mensuráveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button
            onClick={() => scrollToSection("contato")}
            className="bg-[#4072b0] hover:bg-[#3d649e] text-white hover:shadow-lg transition-all"
          >
            Solicite uma proposta personalizada
          </Button>
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
