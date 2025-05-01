"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/integrated-logo.png" alt="Integrare" width={150} height={40} className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className={`text-base font-medium transition-colors hover:text-[#4b7bb5] ${
              isActive("/") ? "text-[#3d649e] font-bold" : "text-gray-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/servicos"
            className={`text-base font-medium transition-colors hover:text-[#4b7bb5] ${
              isActive("/servicos") ? "text-[#3d649e] font-bold" : "text-gray-600"
            }`}
          >
            Serviços
          </Link>
          <Link
            href="/portfolio"
            className={`text-base font-medium transition-colors hover:text-[#4b7bb5] ${
              isActive("/portfolio") ? "text-[#3d649e] font-bold" : "text-gray-600"
            }`}
          >
            Portfólio
          </Link>
          <Link
            href="/sobre"
            className={`text-base font-medium transition-colors hover:text-[#4b7bb5] ${
              isActive("/sobre") ? "text-[#3d649e] font-bold" : "text-gray-600"
            }`}
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className={`text-base font-medium transition-colors hover:text-[#4b7bb5] ${
              isActive("/contato") ? "text-[#3d649e] font-bold" : "text-gray-600"
            }`}
          >
            Contato
          </Link>
        </nav>
        <div className="hidden md:flex">
          <Link href="/contato">
            <Button className="bg-[#3d649e] text-white hover:bg-[#4b7bb5] rounded-md">Fale Conosco</Button>
          </Link>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden text-gray-700" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="container flex h-20 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/integrated-logo.png" alt="Integrare" width={150} height={40} className="h-10 w-auto" />
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-8 px-4 py-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-medium" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/servicos" className="flex items-center gap-2 text-lg font-medium" onClick={toggleMenu}>
              Serviços
            </Link>
            <Link href="/portfolio" className="flex items-center gap-2 text-lg font-medium" onClick={toggleMenu}>
              Portfólio
            </Link>
            <Link href="/sobre" className="flex items-center gap-2 text-lg font-medium" onClick={toggleMenu}>
              Sobre
            </Link>
            <Link href="/contato" className="flex items-center gap-2 text-lg font-medium" onClick={toggleMenu}>
              Contato
            </Link>
            <Link href="/contato" onClick={toggleMenu}>
              <Button className="w-full bg-[#3d649e] text-white hover:bg-[#4b7bb5] rounded-md">Fale Conosco</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
