"use client"

import { useState, useEffect, useRef } from "react"
import { Target, TrendingUp, Users } from "lucide-react"

export function AboutSection() {
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

  return (
    <section id="sobre" ref={sectionRef} className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#4b7bb5]/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#6b91c1]/5 rounded-tr-full"></div>

      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div
            className={`inline-block py-1 px-3 rounded-full border border-[#4072b0]/20 text-[#4072b0] dark:text-[#6b91c1] text-sm font-medium mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Nossa História
          </div>
          <h2
            className={`text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Somos a Integrare
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
            Marketing não é apenas sobre vender mais, é sobre ter propósito e mostrar isso para o mundo. É uma
            ferramenta de reafirmação do porquê viemos e para que estamos aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4b7bb5]/30 to-transparent mix-blend-overlay group-hover:opacity-75 transition-opacity duration-500"></div>
              <img
                src="/digital-marketing-team.png"
                alt="Equipe da Integrare em reunião"
                className="w-full h-auto rounded-xl transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badge flutuante */}
              <div className="absolute -bottom-4 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-transform duration-500 group-hover:transform group-hover:-translate-y-2">
                <p className="text-sm font-semibold text-[#3d649e] dark:text-[#6b91c1]">Fundada em 2020</p>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <h3 className="text-2xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-6">Quem Somos</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em evidências
              científicas e casos práticos de sucesso. Começamos oferecendo serviços simples de gestão de social media e
              hoje oferecemos um ecossistema completo de serviços de marketing.
            </p>

            <div className="space-y-6">
              <div className="flex gap-5 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 shadow-md hover:shadow-lg transition-all group">
                <div className="mt-1">
                  <div className="p-3 bg-[#4b7bb5]/10 rounded-lg group-hover:bg-[#4b7bb5]/20 transition-colors">
                    <Target className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Nossa Filosofia</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque
                    nosso compromisso é com os resultados que entregamos.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 shadow-md hover:shadow-lg transition-all group">
                <div className="mt-1">
                  <div className="p-3 bg-[#4b7bb5]/10 rounded-lg group-hover:bg-[#4b7bb5]/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Nossa Visão</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos
                    nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 shadow-md hover:shadow-lg transition-all group">
                <div className="mt-1">
                  <div className="p-3 bg-[#4b7bb5]/10 rounded-lg group-hover:bg-[#4b7bb5]/20 transition-colors">
                    <Users className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Nosso Objetivo</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Nosso objetivo é que nosso cliente tenha confiança e nosso concorrente ansiedade quando pensa em
                    nós.
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
