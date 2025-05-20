"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

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
    <section ref={sectionRef} className="relative py-8 md:py-12 lg:py-16 overflow-hidden text-white">
      {/* Nova imagem de fundo com nuvem */}
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

      {/* Elementos decorativos flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6b91c1]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#4072b0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#527eb7]/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-4">
              <div className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-2 animate-fadeIn">
                Agência de Marketing Digital
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Agência Integrare de Marketing{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2f1ef]">
                Maringá Curitiba São Paulo
              </span>
            </h1>
            <p className="mt-3 text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">
              Transformamos negócios através de estratégias de marketing baseadas em dados e focadas em resultados
              mensuráveis.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-[#3d649e] hover:bg-white/90 dark:bg-white/90 dark:hover:bg-white shadow-lg hover:shadow-xl transition-all"
                onClick={() => scrollToSection("sobre")}
              >
                Conheça Nossa Abordagem
              </Button>
              <Button
                size="lg"
                className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white shadow-lg hover:shadow-xl transition-all"
                onClick={() => scrollToSection("contato")}
              >
                Fale Conosco
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            className={`hidden md:block transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6b91c1] to-[#4072b0] rounded-lg blur-md opacity-75 animate-pulse"></div>
              <div className="relative rounded-lg shadow-2xl overflow-hidden backdrop-blur">
                <img
                  src="/marketing-agency-team.png"
                  alt="Equipe de marketing digital trabalhando"
                  className="relative rounded-lg shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3d649e]/40 to-transparent mix-blend-overlay"></div>
              </div>

              {/* Elementos flutuantes */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-lg shadow-xl p-4 transform rotate-6 animate-float">
                <div className="flex items-center justify-center h-full">
                  <div>
                    <div className="text-3xl font-bold text-[#3d649e]">250%</div>
                    <div className="text-xs text-[#4b7bb5]">Aumento médio em conversões</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#4072b0] rounded-full shadow-xl p-4 transform -rotate-12 animate-float-delayed">
                <div className="flex items-center justify-center h-full text-white text-center">
                  <div>
                    <div className="text-2xl font-bold">5★</div>
                    <div className="text-xs">Avaliação dos clientes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aumentei o espaço para o conteúdo e abaixei o corte branco */}
      <div className="pb-24 md:pb-32 lg:pb-40"></div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
