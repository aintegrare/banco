"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Lista de clientes com seus logos
const clients = [
  { name: "Carla Mendes", logo: "/clients/carla-mendes.png" },
  { name: "YouMais", logo: "/clients/youmais.png" },
  { name: "Sanches Odontologia", logo: "/clients/sanches-odontologia.png" },
  { name: "Espaço Chic", logo: "/clients/espaco-chic.jpeg" },
  { name: "Marina Regiani", logo: "/clients/marina-regiani.png" },
  { name: "Portal da Cidade", logo: "/clients/portal-cidade.png" },
  { name: "Wood 4 All", logo: "/clients/wood4all.png" },
  { name: "Jon Ric Medical Spa", logo: "/clients/jonric.png" },
  { name: "Eletro Beltrão", logo: "/clients/eletro-beltrao.png" },
  { name: "Cacau Show", logo: "/clients/cacau-show.png" },
  { name: "Clínica Lupe PSA", logo: "/clients/clinica-lupe.png" },
  { name: "EEE Dental", logo: "/clients/eee-dental.png" },
  { name: "De Pieri", logo: "/clients/de-pieri.jpeg" },
  { name: "Conexão Digital", logo: "/clients/conexao-digital.png" },
  { name: "Atlantia", logo: "/clients/atlantia.png" },
  { name: "Eletroritz", logo: "/clients/eletroritz.png" },
]

export function ClientsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const sectionRef = useRef<HTMLElement>(null)

  // Atualiza o número de itens por página com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(6)
      } else {
        setItemsPerPage(8)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

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
      window.removeEventListener("resize", handleResize)
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Calcula o número total de páginas
  const totalPages = Math.ceil(clients.length / itemsPerPage)

  // Navegação do carrossel
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  // Avança automaticamente a cada 5 segundos
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      nextPage()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentPage, isVisible])

  // Clientes visíveis na página atual
  const visibleClients = clients.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <section id="clientes" ref={sectionRef} className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Nossos Clientes
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empresas que confiam em nosso trabalho para impulsionar seus resultados.
          </p>
        </div>

        <div className="relative">
          {/* Controles de navegação */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-4 px-2 md:px-4 z-10">
            <button
              onClick={prevPage}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md hover:bg-[#4072b0] hover:text-white dark:hover:bg-[#6b91c1] transition-colors"
              aria-label="Clientes anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextPage}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md hover:bg-[#4072b0] hover:text-white dark:hover:bg-[#6b91c1] transition-colors"
              aria-label="Próximos clientes"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Grid de logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleClients.map((client, index) => (
              <div
                key={index}
                className={`flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  filter: "grayscale(100%)",
                  height: "120px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "grayscale(0%)"
                  e.currentTarget.style.transform = "scale(1.05)"
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "grayscale(100%)"
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = ""
                }}
              >
                <img
                  src={client.logo || "/placeholder.svg"}
                  alt={`Logo ${client.name}`}
                  className="max-h-16 max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Indicadores de página */}
          <div className="flex justify-center mt-6 gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentPage ? "w-6 bg-[#4072b0] dark:bg-[#6b91c1]" : "w-2 bg-gray-300 dark:bg-gray-700"
                }`}
                aria-label={`Ir para página ${i + 1} de clientes`}
              />
            ))}
          </div>
        </div>

        {/* Contador de clientes */}
        <div className="mt-12 text-center">
          <div className="inline-block px-4 py-2 bg-[#4b7bb5]/10 dark:bg-[#6b91c1]/20 rounded-full">
            <p className="text-[#3d649e] dark:text-[#6b91c1] font-medium">
              <span className="font-bold">{clients.length}+</span> clientes satisfeitos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
