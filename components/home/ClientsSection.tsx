"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function ClientsSection() {
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

  const clients = [
    { name: "Carla Mendes", logo: "/clients/carla-mendes.png" },
    { name: "YouMais", logo: "/clients/youmais.png" },
    { name: "Sanches Odontologia", logo: "/clients/sanches-odontologia.png" },
    { name: "Espaço Chic Boutique", logo: "/clients/espaco-chic.jpeg" },
    { name: "Marina Regiani", logo: "/clients/marina-regiani.png" },
    { name: "Portal da Cidade", logo: "/clients/portal-cidade.png" },
    { name: "Wood 4 All", logo: "/clients/wood4all.png" },
    { name: "Jon Ric Medical Spa", logo: "/clients/jonric.png" },
    { name: "Eletro Beltrão", logo: "/clients/eletro-beltrao.png" },
    { name: "Cacau Show", logo: "/clients/cacau-show.png" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="clientes" ref={sectionRef} className="py-20 bg-[#f2f1ef] dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Nossos Clientes
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empresas que confiam em nosso trabalho e crescem com nossas estratégias.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {clients.map((client, index) => (
            <motion.div key={index} variants={itemVariants} className="flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center h-32 w-full">
                <img
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  className="max-h-16 max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
