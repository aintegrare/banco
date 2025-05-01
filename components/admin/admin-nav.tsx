"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, FileText, Settings, Menu, X, PenToolIcon as Tool } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  // Adicionar um novo item ao array navItems para a página de ferramentas
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/arquivos", label: "Arquivos", icon: FileText },
    { href: "/admin/ferramentas", label: "Ferramentas", icon: Tool },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
    { href: "/", label: "Voltar ao Site", icon: Search },
  ]

  return (
    <div className="bg-[#4b7bb5] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="font-bold text-xl">
              Integrare Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href) ? "bg-[#3d649e] text-white" : "text-white hover:bg-[#527eb7] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#527eb7]"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href) ? "bg-[#3d649e] text-white" : "text-white hover:bg-[#527eb7] hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
