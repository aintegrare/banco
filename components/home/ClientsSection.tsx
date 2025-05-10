"use client"

import { useState, useEffect, useRef } from "react"

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
    { name: "Cliente 1", logo: "/client-logo-1.png" },
    { name: "Cliente 2", logo: "/client-logo-2.png" },
    { name: "Cliente 3", logo: "/client-logo-3.png" },
    { name: "Cliente 4", logo: "/client-logo-4.png" },
    { name: "Cliente 5", logo: "/client-logo-5.png" },
    { name: "Cliente 6", logo: "/client-logo-6.png" },
    { name: "Cliente 7", logo: "/client-logo-7.png" },
    { name: "Cliente 8", logo: "/client-logo-8.png" },
  ]

  return (
    <section id="clientes" ref={sectionRef} className="py-20 bg-[#f2f1ef] dark:bg-gray-800">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Nossos Clientes
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empresas que confiam em nosso trabalho e crescem com nossas estratégias.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {clients.map((client, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center h-32">
                <img
                  src={client.logo || "/placeholder.svg?height=80&width=160&query=logo"}
                  alt={client.name}
                  className="max-h-16 max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
