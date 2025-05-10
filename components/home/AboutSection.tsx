"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle } from "lucide-react"

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
    <section id="sobre" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Quem Somos
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Marketing não é sobre vender mais, é sobre ter propósito e mostrar isso para o mundo. É uma ferramenta de
            reafirmação do porquê viemos e para que estamos aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4b7bb5]/30 to-transparent mix-blend-overlay"></div>
              <img src="/about-image.png" alt="Equipe da Integrare em reunião" className="w-full h-auto rounded-lg" />
            </div>
          </div>
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <h3 className="text-2xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-6">Nossa História</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em evidências
              científicas e casos práticos de sucesso. Começamos oferecendo serviços simples de gestão de social media e
              hoje oferecemos um ecossistema completo de serviços de marketing.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Nossa Filosofia</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque
                    nosso compromisso é com os resultados que entregamos.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Nossa Visão</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos
                    nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all">
                <CheckCircle className="h-6 w-6 text-[#4b7bb5] dark:text-[#6b91c1] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Nosso Objetivo</h4>
                  <p className="text-gray-600 dark:text-gray-400">
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
