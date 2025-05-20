"use client"

import { useState, useEffect, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  date: string
  response?: string
}

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const testimonialsPerPage = 3
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Simular carregamento de depoimentos do "banco de dados"
  useEffect(() => {
    // Dados dos depoimentos
    const allTestimonials: Testimonial[] = [
      {
        id: "1",
        name: "Ellen Akemi",
        content: "Excelente!",
        date: "Há 13 horas",
      },
      {
        id: "2",
        name: "Aline Paola",
        content: "Muito bom! Recomendo",
        date: "Há 3 dias",
      },
      {
        id: "3",
        name: "Ana Clara Ribeiro",
        content: "Muito incrível, empresa capacitada e atendimento muito bom",
        date: "Há 3 semanas",
      },
      {
        id: "4",
        name: "Bruno Magalhães",
        content:
          "Atendimento excelente. Já havia tido experiências relacionadas à serviços de marketing pelo Paraná, especialmente em Maringá, mas a Integrare superou todas as expectativas.",
        date: "Há 14 semanas",
      },
      {
        id: "5",
        name: "Leonardo Martins",
        content: "Equipe qualificada e com atendimento muito bom",
        date: "Há 14 semanas",
      },
      {
        id: "6",
        name: "Mateus Dias",
        content:
          "Excelente! Mudou as diretrizes da minha empresa, me apresentaram soluções personalizadas para o que eu procurava.",
        date: "Há 14 semanas",
      },
      {
        id: "7",
        name: "Ana Claudia",
        content:
          "Estou gostando muito de trabalhar com essa empresa! São prestativos, atendimento humanizado e super preocupados com a satisfação do cliente.",
        date: "Há 15 semanas",
      },
      {
        id: "8",
        name: "Cintia Sanches",
        content:
          "Fui muitooo bem atendida pela agência! Foram atenciosos e rápidos em me atender e esclarecer minhas dúvidas sempre que precisei. Pessoal simpático, capacitados e preocupados com o cliente. Não tenho do que reclamar",
        date: "Há 35 semanas",
      },
      {
        id: "9",
        name: "Felipe",
        content: "Serviço de excelente qualidade!",
        date: "Há 41 semanas",
      },
      {
        id: "10",
        name: "Caroline dos Santos",
        content: "Recomendo todos os serviços! Ótimo atendimento e equipe nota mil!",
        date: "Há 41 semanas",
      },
      {
        id: "11",
        name: "Eloysa Bianca",
        content: "Melhor agência de marketing!",
        date: "Há 46 semanas",
      },
      {
        id: "12",
        name: "Bianca Alves",
        content:
          "Empresa de Marketing com Bastante expertise. CEO com conhecimento embasado e formado em diversas áreas como economia e inovação",
        date: "28 de mar. de 2024",
      },
      {
        id: "13",
        name: "Leticia Perciliano Sakurai",
        content:
          "Profissionais incríveis e cuidadosos com seus trabalhos! Uma agência com abrangência de atividades, isso colabora muito com os resultados!!",
        date: "26 de mar. de 2024",
      },
      {
        id: "14",
        name: "Única Imóveis",
        content: "Excelente serviço e atendimento!",
        date: "26 de mar. de 2024",
      },
      {
        id: "15",
        name: "Tayna Karollyna",
        content:
          "Muito atenciosos e prestativos, sinto que precisarei novamente dos trabalhos prestados com tanto cuidado.",
        date: "15 de mar. de 2024",
      },
      {
        id: "16",
        name: "Carine Vi",
        content: "Empresa responsável, colaboradores educados e serviço de ótima qualidade. Super indico.",
        date: "5 de fev. de 2024",
      },
      {
        id: "17",
        name: "Giulia Monteschio",
        content: "Indico muito! Empresa mais que qualificada, pontuais e preocupados com o cliente!",
        date: "1 de fev. de 2024",
      },
      {
        id: "18",
        name: "Maritcheli Vieira",
        content: "Empresa e profissionais experts na área. Sem falar do quanto são atenciosos!",
        date: "31 de jan. de 2024",
      },
      {
        id: "19",
        name: "Gabrielly Monteiro",
        content:
          "Sou cliente antiga e sempre recomendo. Todos os profissionais são capacitados e demonstram real interesse em ajudar o cliente a obter resultados. O diretor é eficiente e sempre está a disposição.",
        date: "30 de jan. de 2024",
      },
      {
        id: "20",
        name: "Julio Sutil",
        content:
          "Tive o prazer de trabalhar com a Agência Integrare em projetos audiovisuais. E estar por dentro dos projetos foi muito gratificante, pois a equipe é muito competente e dedicada.",
        date: "30 de jan. de 2024",
      },
      // Adicionando mais depoimentos
      {
        id: "21",
        name: "Adriane Lorenzzon",
        content: "Um excelente atendimento ótimo profissional",
        date: "22 de dez. de 2023",
      },
      {
        id: "22",
        name: "Paulo Sanches",
        content: "Super confiável e eficiente!!!!",
        date: "22 de dez. de 2023",
      },
      {
        id: "23",
        name: "Íze Ayres",
        content: "Serviço de qualidade e atendimento excelente!",
        date: "22 de dez. de 2023",
      },
      {
        id: "24",
        name: "Vanessa M Silva",
        content:
          "Sou cliente há anos e estou muito satisfeita com o serviço prestado. O CEO é extremamente atencioso e preocupado com a satisfação do cliente.",
        date: "19 de dez. de 2023",
      },
      {
        id: "25",
        name: "Higor Vendrame",
        content: "Ótimo atendimento, excelentes profissionais, suporte deles são perfeito, super recomendo",
        date: "5 de dez. de 2023",
      },
      {
        id: "26",
        name: "Renata Hurtado",
        content:
          "Ótimo atendimento, profissionais sempre à disposição para tirar dúvidas e atender ao que o cliente precisa. Recomendo!",
        date: "26 de nov. de 2023",
      },
      {
        id: "27",
        name: "Maria Antonia Zanta Nobre",
        content: "Time super dedicado para atender todas as necessidades! Parabéns pelo trabalho!",
        date: "12 de nov. de 2023",
      },
      {
        id: "28",
        name: "Milene Müller",
        content: "A Integrare é dedicação plena, com a inovação como guia e de um trabalho fino de olhar amplo.",
        date: "26 de jul. de 2023",
      },
      {
        id: "29",
        name: "Victoria Fernandes",
        content: "Excelente serviço e atendimento!",
        date: "16 de jul. de 2023",
      },
      {
        id: "30",
        name: "Thaiane Tizo",
        content: "Equipe atenciosa, recomendo!",
        date: "16 de jul. de 2023",
      },
    ]

    // Simular um pequeno atraso de carregamento
    setTimeout(() => {
      setTestimonials(allTestimonials)
      setIsLoading(false)
    }, 500)
  }, [])

  // Autoplay
  useEffect(() => {
    if (inView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(testimonials.length / testimonialsPerPage))
      }, 5000)
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [inView, testimonials.length])

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)
  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage,
  )

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <section id="depoimentos" className="py-16 bg-[#f2f1ef] dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mais de 100 clientes satisfeitos compartilham suas experiências com nossos serviços de marketing digital.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="ml-2 font-medium">5.0/5.0 (40+ avaliações)</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4"></div>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg relative"
                >
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-[#4b7bb5]/10 dark:text-[#6b91c1]/10" />
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.content}</p>
                  <div className="flex items-center mt-4">
                    <div className="bg-[#4b7bb5] text-white h-10 w-10 rounded-full flex items-center justify-center font-medium">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles de navegação */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </button>

              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === currentPage
                        ? "w-8 bg-[#4b7bb5] dark:bg-[#6b91c1]"
                        : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    }`}
                    aria-label={`Ir para página ${i + 1}`}
                    aria-current={i === currentPage ? "page" : undefined}
                  ></button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-5 w-5 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://www.redeintegrare.com/depoimentos"
            className="inline-flex items-center text-[#4b7bb5] dark:text-[#6b91c1] hover:underline font-medium"
          >
            Ver todos os depoimentos
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
