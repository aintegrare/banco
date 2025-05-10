"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogSection() {
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

  const blogPosts = [
    {
      title: "Como aumentar suas conversões em 200% com marketing de conteúdo",
      excerpt:
        "Descubra as estratégias que utilizamos para aumentar as conversões dos nossos clientes através de conteúdo estratégico.",
      image: "/blog-post-1.png",
      date: "12 Mai 2023",
      category: "Marketing de Conteúdo",
      slug: "/blog/como-aumentar-conversoes-marketing-conteudo",
    },
    {
      title: "SEO em 2023: O que mudou e como se adaptar",
      excerpt:
        "As principais mudanças nos algoritmos de busca e como adaptar sua estratégia de SEO para continuar ranqueando bem.",
      image: "/blog-post-2.png",
      date: "28 Abr 2023",
      category: "SEO",
      slug: "/blog/seo-2023-mudancas-adaptacao",
    },
    {
      title: "5 estratégias de tráfego pago que realmente funcionam",
      excerpt:
        "Conheça as estratégias de tráfego pago que estão gerando os melhores resultados para nossos clientes em 2023.",
      image: "/blog-post-3.png",
      date: "15 Abr 2023",
      category: "Tráfego Pago",
      slug: "/blog/5-estrategias-trafego-pago",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-[#f2f1ef] dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">Blog</h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conteúdo relevante para ajudar seu negócio a crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${200 * index}ms` }}
            >
              <Link href={post.slug} className="block h-full">
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden group dark:bg-gray-900 dark:text-white">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=200&width=400&query=blog"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="text-xs font-medium bg-[#4072b0] px-2 py-1 rounded-full">{post.category}</span>
                      <p className="text-xs mt-2">{post.date}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-[#4072b0] dark:text-[#6b91c1] font-medium">
                      <span>Ler mais</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]">
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
