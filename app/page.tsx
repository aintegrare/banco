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
  return (
    <div className="min-h-screen">
      <main>
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
    </div>
  )
}
