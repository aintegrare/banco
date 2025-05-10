"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Header } from "@/components/home/Header"
import { HeroSection } from "@/components/home/HeroSection"
import { AboutSection } from "@/components/home/AboutSection"
import { ServicesSection } from "@/components/home/ServicesSection"
import { ResultsSection } from "@/components/home/ResultsSection"
import { ClientsSection } from "@/components/home/ClientsSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { BlogSection } from "@/components/home/BlogSection"
import { ContactSection } from "@/components/home/ContactSection"
import { Footer } from "@/components/home/Footer"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    setIsPageLoaded(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className={`flex min-h-screen flex-col ${isPageLoaded ? "animate-fadeIn" : "opacity-0"}`}>
      <Header isScrolled={isScrolled} />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ResultsSection />
        <ClientsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button" aria-label="Voltar ao topo">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
