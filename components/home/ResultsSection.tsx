"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Users, Target } from "lucide-react"
import { StatCard } from "@/components/shared/StatCard"

export function ResultsSection() {
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

  const cases = [
    {
      title: "Aumento de 300% em Leads",
      client: "E-commerce de Moda",
      description:
        "Implementamos uma estratégia completa de marketing digital que resultou em um aumento de 300% na geração de leads qualificados em apenas 3 meses.",
      metrics: ["300% mais leads", "45% redução no CAC", "89% aumento em vendas"],
      image: "/case-study-1.png",
    },
    {
      title: "Crescimento de 200% em Seguidores",
      client: "Clínica de Estética",
      description:
        "Desenvolvemos uma estratégia de conteúdo para redes sociais que resultou em um crescimento de 200% na base de seguidores e 150% no engajamento.",
      metrics: ["200% mais seguidores", "150% mais engajamento", "78% aumento em agendamentos"],
      image: "/case-study-2.png",
    },
    {
      title: "ROI de 500% em Campanhas",
      client: "Empresa de Tecnologia",
      description:
        "Criamos campanhas de tráfego pago altamente segmentadas que geraram um ROI de 500% e reduziram o custo por aquisição em 60%.",
      metrics: ["500% ROI", "60% redução no CPA", "320% aumento em conversões"],
      image: "/case-study-3.png",
    },
  ]

  return (
    <section id="resultados" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Cases de Sucesso
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conheça alguns dos resultados que alcançamos para nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${200 * index}ms` }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden group dark:bg-gray-900 dark:text-white">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={caseStudy.image || "/placeholder.svg"}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4b7bb5]/80 to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <p className="text-sm font-medium">{caseStudy.client}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-2">{caseStudy.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{caseStudy.description}</p>
                  <div className="space-y-2">
                    {caseStudy.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <StatCard
              icon={<TrendingUp className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+300%"
              description="Aumento médio em conversões"
            />
          </div>
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <StatCard
              icon={<Users className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+200%"
              description="Aumento em engajamento"
            />
          </div>
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <StatCard
              icon={<Target className="h-8 w-8 text-[#4072b0] dark:text-[#6b91c1]" />}
              value="+500%"
              description="ROI médio em campanhas"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
