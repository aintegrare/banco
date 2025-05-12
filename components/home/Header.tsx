"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, BookOpen } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HeaderProps {
  isScrolled: boolean
}

export function Header({ isScrolled }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

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

  const navigateToBlog = () => {
    closeMenu()
    router.push("/blog")
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm py-3"
          : "bg-white dark:bg-gray-900 py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            {/* Logo correta da Integrare */}
            <img
              src="/logo-integrare-new.png"
              alt="Integrare Marketing"
              className="h-12 w-auto"
              style={{ display: "block" }}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("sobre")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors relative group"
          >
            Sobre
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4b7bb5] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => scrollToSection("servicos")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors relative group"
          >
            Serviços
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4b7bb5] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => scrollToSection("resultados")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors relative group"
          >
            Cases
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4b7bb5] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => scrollToSection("clientes")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors relative group"
          >
            Clientes
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4b7bb5] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => scrollToSection("depoimentos")}
            className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] dark:text-[#6b91c1] dark:hover:text-white transition-colors relative group"
          >
            Depoimentos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4b7bb5] group-hover:w-full transition-all duration-300"></span>
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-[#6b91c1]" />
            ) : (
              <Moon className="h-5 w-5 text-[#4072b0]" />
            )}
          </button>

          <Button
            onClick={navigateToBlog}
            className="hidden md:flex items-center gap-1 bg-[#527eb7] hover:bg-[#3d649e] text-white dark:bg-[#6b91c1] dark:hover:bg-[#4b7bb5] transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Blog
          </Button>

          <Button
            onClick={() => scrollToSection("contato")}
            className="hidden md:flex bg-[#4072b0] hover:bg-[#3d649e] text-white dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] transition-colors"
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

      {/* Mobile Menu - Com animação de slide */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Link href="/">
                {/* Logo correta da Integrare no menu mobile */}
                <img
                  src="/logo-integrare-new.png"
                  alt="Integrare Marketing"
                  className="h-12 w-auto"
                  style={{ display: "block" }}
                />
              </Link>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("sobre")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Sobre</span>
              <span className="text-[#4b7bb5]/50">01</span>
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Serviços</span>
              <span className="text-[#4b7bb5]/50">02</span>
            </button>
            <button
              onClick={() => scrollToSection("resultados")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Cases</span>
              <span className="text-[#4b7bb5]/50">03</span>
            </button>
            <button
              onClick={() => scrollToSection("clientes")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Clientes</span>
              <span className="text-[#4b7bb5]/50">04</span>
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Depoimentos</span>
              <span className="text-[#4b7bb5]/50">05</span>
            </button>
            <button
              onClick={navigateToBlog}
              className="py-3 px-4 text-lg font-medium bg-[#527eb7] text-white hover:bg-[#3d649e] dark:bg-[#6b91c1] dark:hover:bg-[#4b7bb5] rounded-md transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Blog
              </span>
              <span className="text-white/50">06</span>
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="py-3 px-4 text-lg font-medium text-[#4b7bb5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Contato</span>
              <span className="text-[#4b7bb5]/50">07</span>
            </button>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => {
                  scrollToSection("contato")
                  closeMenu()
                }}
                size="lg"
                className="w-full bg-[#4072b0] hover:bg-[#3d649e] text-white dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1]"
              >
                Fale Conosco
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
