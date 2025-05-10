"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// Dados das avaliações
const testimonials = [
  {
    name: "Ellen Akemi",
    date: "Há 13 horas",
    text: "Excelente!",
    reply: "Obrigado, Ellen! :)",
  },
  {
    name: "Aline Paola",
    date: "Há 3 dias",
    text: "Muito bom! Recomendo",
  },
  {
    name: "Ana Clara Ribeiro",
    date: "Há 3 semanas",
    text: "Muito incrível, empresa capacitada e atendimento muito bom",
    reply: "Obrigado, Clara! Com clientes que colaboram e profissionais que sabem o que fazem, as coisas fluem.",
  },
  {
    name: "Bruno Magalhães",
    date: "Há 14 semanas",
    text: "Atendimento excelente. Já havia tido experiências relacionadas à serviços de marketing pelo Paraná, especialmente em Maringá, mas a Integrare superou todas as expectativas.",
    reply: "Obrigado por compartilhar. Estamos sempre a disposição! <3",
  },
  {
    name: "Leonardo Martins",
    date: "Há 14 semanas",
    text: "Equipe qualificada e com atendimento muito bom",
  },
  {
    name: "Mateus Dias",
    date: "Há 14 semanas",
    text: "Excelente! Mudou as diretrizes da minha empresa, me apresentaram soluções personalizadas para o que eu procurava. Além do atendimento excepcional.",
  },
  {
    name: "Ana Claudia",
    date: "Há 15 semanas",
    text: "Estou gostando muito de trabalhar com essa empresa! São prestativos, atendimento humanizado e super preocupados com a satisfação do cliente.",
  },
  {
    name: "Cintia Sanches",
    date: "Há 35 semanas",
    text: "Fui muitooo bem atendida pela agência! Foram atenciosos e rápidos em me atender e esclarecer minhas dúvidas sempre que precisei. Pessoal simpático, capacitados e preocupados com o cliente. Não tenho do que reclamar",
  },
  {
    name: "Felipe",
    date: "Há 41 semanas",
    text: "Ótimo atendimento e serviço de qualidade!",
  },
  {
    name: "Caroline dos Santos",
    date: "Há 41 semanas",
    text: "Recomendo todos os serviços! Ótimo atendimento e equipe nota mil!",
    reply: "Obrigado, Caroline! :)",
  },
  {
    name: "Eloysa Bianca",
    date: "Há 46 semanas",
    text: "Melhor agência de marketing!",
    reply: "Obrigado Eloysa! Muito importante esse feedback.",
  },
  {
    name: "Bianca Alves",
    date: "28 de mar. de 2024",
    text: "Empresa de Marketing com Bastante expertise. CEO com conhecimento embasado e formado em diversas áreas como economia e inovação",
    reply:
      "Obrigado pela avaliação, Bianca. Ficamos muito felizes pelo comentário e agora que teremos o seu reforço no time, a expectativa e tendência é só melhorar! 🤗 🤝",
  },
  {
    name: "Leticia Perciliano Sakurai",
    date: "26 de mar. de 2024",
    text: "Profissionais incríveis e cuidadosos com seus trabalhos! Uma agência com abrangência de atividades, isso colabora muito com os resultados!!",
    reply: "Obrigado, Letícia! <3",
  },
  {
    name: "Única Imóveis",
    date: "26 de mar. de 2024",
    text: "Excelente serviço e atendimento!",
    reply: "Obrigado, Única! Clientes 10/10!",
  },
  {
    name: "Tayna Karollyna",
    date: "15 de mar. de 2024",
    text: "Muito atenciosos e prestativos, sinto que precisarei novamente dos trabalhos prestados com tanto cuidado.",
  },
  {
    name: "Carine Vi",
    date: "5 de fev. de 2024",
    text: "Empresa responsável, colaboradores educados e serviço de ótima qualidade. Super indico.",
  },
  {
    name: "Giulia Monteschio",
    date: "1 de fev. de 2024",
    text: "Indico muito! Empresa mais que qualificada, pontuais e preocupados com o cliente!",
  },
  {
    name: "Maritcheli Vieira",
    date: "31 de jan. de 2024",
    text: "Empresa e profissionais experts na área. Sem falar do quanto são atenciosos!",
  },
  {
    name: "Gabrielly Monteiro",
    date: "30 de jan. de 2024",
    text: "Sou cliente antiga e sempre recomendo. Todos os profissionais são capacitados e demonstram real interesse em ajudar o cliente a obter resultados. O diretor é eficiente e sempre está a disposição.",
    reply: "Obrigado Gabrielly. Sempre que precisar estaremos aqui.",
  },
  {
    name: "Julio Sutil",
    date: "30 de jan. de 2024",
    text: "Tive o prazer de trabalhar com a Agência Integrare em projetos audiovisuais. E estar por dentro dos projetos foi muito gratificante, pois a equipe é muito competente e dedicada.",
    reply: "Obrigado, Julio! Agradecemos a valorização de um dos nossos pontos altos: tech! Forte abraço.",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Determina quantos depoimentos mostrar com base na largura da tela
  const updateVisibleCount = useCallback(() => {
    if (window.innerWidth < 640) {
      setVisibleCount(1)
    } else if (window.innerWidth < 1024) {
      setVisibleCount(2)
    } else {
      setVisibleCount(3)
    }
  }, [])

  useEffect(() => {
    // Atualiza o número de depoimentos visíveis quando a tela é redimensionada
    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)

    // Observer para animação de entrada
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
      window.removeEventListener("resize", updateVisibleCount)
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [updateVisibleCount])

  // Navegação do carrossel
  const next = useCallback(() => {
    setActiveIndex((current) => (current + visibleCount >= testimonials.length ? 0 : current + visibleCount))
  }, [visibleCount])

  const prev = useCallback(() => {
    setActiveIndex((current) =>
      current - visibleCount < 0 ? Math.max(testimonials.length - visibleCount, 0) : current - visibleCount,
    )
  }, [visibleCount])

  // Avança automaticamente a cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible) {
        next()
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [next, isVisible])

  // Calcula o número total de páginas
  const totalPages = Math.ceil(testimonials.length / visibleCount)
  const currentPage = Math.floor(activeIndex / visibleCount)

  return (
    <section id="depoimentos" ref={sectionRef} className="py-16 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mais de 40 avaliações 5 estrelas. Veja o que nossos clientes têm a dizer sobre nossa parceria.
          </p>
        </div>

        <div className="relative">
          {/* Controles de navegação */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-4 px-2 md:px-4 z-10">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-[#4072b0] hover:text-white dark:hover:bg-[#6b91c1] transition-colors"
              aria-label="Depoimentos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-[#4072b0] hover:text-white dark:hover:bg-[#6b91c1] transition-colors"
              aria-label="Próximos depoimentos"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Carrossel de depoimentos */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div
                    className={`h-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col transition-all duration-300 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {/* Estrelas */}
                    <div className="flex mb-3 text-[#4072b0] dark:text-[#6b91c1]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    {/* Texto do depoimento */}
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">"{testimonial.text}"</p>

                    {/* Informações do cliente */}
                    <div className="mt-auto">
                      <p className="font-semibold text-[#3d649e] dark:text-[#6b91c1]">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.date}</p>

                      {/* Resposta da agência (se houver) */}
                      {testimonial.reply && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            <span className="font-medium">Resposta da Integrare:</span> {testimonial.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de página */}
          <div className="flex justify-center mt-6 gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i * visibleCount)}
                className={`h-2 rounded-full transition-all ${
                  i === currentPage ? "w-6 bg-[#4072b0] dark:bg-[#6b91c1]" : "w-2 bg-gray-300 dark:bg-gray-700"
                }`}
                aria-label={`Ir para página ${i + 1} de depoimentos`}
              />
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-12 text-center">
          <div className="inline-block px-4 py-2 bg-[#4b7bb5]/10 dark:bg-[#6b91c1]/20 rounded-full">
            <p className="text-[#3d649e] dark:text-[#6b91c1] font-medium">
              <span className="font-bold">100%</span> das avaliações são 5 estrelas
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
