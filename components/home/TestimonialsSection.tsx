"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

export function TestimonialsSection() {
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

  const testimonials = [
    {
      quote:
        "A Integrare transformou completamente nossa presença digital. Em apenas 6 meses, vimos um aumento significativo nas vendas e no reconhecimento da marca. A equipe é extremamente profissional e dedicada aos resultados.",
      author: "Ana Silva",
      position: "Moda Express",
      image: "/testimonial-1.png",
    },
    {
      quote:
        "O que mais me impressiona na Integrare é o compromisso com resultados. Eles realmente tratam nosso negócio como se fosse deles e isso faz toda a diferença. Nossa presença online nunca esteve tão forte.",
      author: "Carlos Mendes",
      position: "Tech Solutions",
      image: "/testimonial-2.png",
    },
    {
      quote:
        "Desde que começamos a trabalhar com a Integrare, nossa agenda está sempre cheia. A estratégia de marketing digital deles é simplesmente excepcional. Recomendo sem hesitar para qualquer empresa que queira crescer.",
      author: "Juliana Costa",
      position: "Clínica Bem Estar",
      image: "/testimonial-3.png",
    },
  ]

  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((current + 1) % testimonials.length)

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 8000)

    return () => clearInterval(interval)
  }, [current])

  return (
    <section id="depoimentos" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Veja o que nossos clientes têm a dizer sobre nossa parceria e resultados alcançados.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Card className="border-none shadow-lg bg-white dark:bg-gray-900 mx-auto max-w-3xl">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#4b7bb5] to-[#3d649e] rounded-full blur opacity-75"></div>
                            <img
                              src={testimonial.image || "/placeholder.svg?height=80&width=80&query=person"}
                              alt={testimonial.author}
                              className="relative w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-800"
                            />
                            <div className="absolute -top-2 -left-2 bg-[#4072b0] dark:bg-[#6b91c1] rounded-full p-1 shadow-md">
                              <Quote className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">{testimonial.quote}</p>
                          <div>
                            <p className="font-semibold text-[#3d649e] dark:text-[#6b91c1]">{testimonial.author}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.position}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant={index === current ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrent(index)}
                className={
                  index === current
                    ? "bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#6b91c1] dark:hover:bg-[#4b7bb5] h-8 w-8 p-0 rounded-full"
                    : "border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white h-8 w-8 p-0 rounded-full transition-colors"
                }
              >
                <span className="sr-only">Depoimento {index + 1}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-[#4072b0] text-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
