"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true) // Ativa animações imediatamente para o hero

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
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
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#3d649e] to-[#4b7bb5] text-white"
    >
      {/* Elementos minimalistas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-white/5"></div>

        {/* Linhas geométricas minimalistas */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.2" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="0.2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Círculos flutuantes sutis */}
        <div className="absolute top-1/3 right-1/5 w-4 h-4 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-6 h-6 rounded-full bg-white/20 animate-pulse delay-300"></div>
        <div className="absolute top-2/3 right-1/3 w-8 h-8 rounded-full bg-white/20 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Conteúdo de texto - ocupa 3/5 em desktop */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Agência de Marketing Digital
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Transformamos <span className="text-[#f2f1ef]">ideias</span> em resultados{" "}
                <span className="text-[#f2f1ef]">mensuráveis</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Estratégias de marketing baseadas em dados que impulsionam o crescimento do seu negócio em Maringá,
                Curitiba e São Paulo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-[#3d649e] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => scrollToSection("sobre")}
                >
                  Conheça Nossa Abordagem
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 shadow-lg transition-all"
                  onClick={() => scrollToSection("contato")}
                >
                  Fale Conosco
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Elemento visual - ocupa 2/5 em desktop */}
          <div
            className={`hidden lg:block lg:col-span-2 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Círculo decorativo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-xl"></div>

              {/* Elemento visual abstrato */}
              <div className="relative aspect-square rounded-full overflow-hidden border border-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-[#6b91c1]/40 to-[#4072b0]/40 animate-pulse"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-white/20 to-white/5 animate-ping animation-delay-700"></div>
                </div>

                {/* Ícones de marketing flutuantes */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-float">
                  <div className="bg-white/90 text-[#3d649e] w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 animate-float-delayed">
                  <div className="bg-white/90 text-[#3d649e] w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute top-1/2 right-1/6 transform translate-x-1/2 -translate-y-1/2 animate-float-slow">
                  <div className="bg-white/90 text-[#3d649e] w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Estatística flutuante */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-4 transform rotate-3 animate-float">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3d649e]">250%</div>
                  <div className="text-xs text-[#4b7bb5]">ROI médio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divisor de onda minimalista */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
