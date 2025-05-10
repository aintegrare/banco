"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface HeaderProps {
  isScrolled: boolean
}

export function Header({ isScrolled }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const scrollToSection = (id: string) => {
    closeMenu()
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img src="/logo-integrare.png" alt="Integrare Logo" className="h-8" />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("sobre")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Sobre
          </button>
          <button
            onClick={() => scrollToSection("servicos")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection("resultados")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Cases
          </button>
          <button
            onClick={() => scrollToSection("clientes")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Clientes
          </button>
          <button
            onClick={() => scrollToSection("depoimentos")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Depoimentos
          </button>
          <a
            href="/blog"
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Blog
          </a>
          <button
            onClick={() => scrollToSection("contato")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors"
          >
            Contato
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => scrollToSection("contato")}
            className="hidden md:flex bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] transition-colors"
          >
            Fale Conosco
          </Button>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            ) : (
              <Menu className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container py-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo-integrare.png" alt="Integrare Logo" className="h-8" />
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <button
              onClick={() => scrollToSection("sobre")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("resultados")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Cases
            </button>
            <button
              onClick={() => scrollToSection("clientes")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Clientes
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Depoimentos
            </button>
            <a
              href="/blog"
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Blog
            </a>
            <button
              onClick={() => scrollToSection("contato")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Contato
            </button>

            <Button
              onClick={() => {
                scrollToSection("contato")
                closeMenu()
              }}
              className="mt-4 bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]"
            >
              Fale Conosco
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
