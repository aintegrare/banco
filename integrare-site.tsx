"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import Head from "next/head"

export default function IntegraeSite() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Pesquisando por: ${searchQuery}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f1ef]">
      <Head>
        <title>Integrare | Agência de Marketing</title>
        <meta
          name="description"
          content="Integrare - Marketing de Qualidade baseado em evidências científicas e casos práticos de sucesso."
        />
      </Head>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-[#4b7bb5] z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white text-xl">
          <a href="#" className="hover:text-[#f2f1ef] transition-colors">
            Início
          </a>
          <a href="#" className="hover:text-[#f2f1ef] transition-colors">
            Serviços
          </a>
          <a href="#" className="hover:text-[#f2f1ef] transition-colors">
            Sobre Nós
          </a>
          <a href="#" className="hover:text-[#f2f1ef] transition-colors">
            Portfólio
          </a>
          <a href="#" className="hover:text-[#f2f1ef] transition-colors">
            Contato
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-[#4b7bb5]">
          <Menu size={24} />
        </button>
        <nav className="hidden md:flex space-x-6 text-[#3d649e]">
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Início
          </a>
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Serviços
          </a>
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Sobre Nós
          </a>
        </nav>
        <nav className="hidden md:flex space-x-6 text-[#3d649e]">
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Portfólio
          </a>
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Contato
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 -mt-16">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#4072b0] mb-2">Integrare</h1>
          <p className="text-[#527eb7]">Agência de Marketing</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise nossos serviços..."
              className="w-full py-4 px-6 pr-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
            />
            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4b7bb5]">
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-[#3d649e]">Social Media</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#527eb7] flex items-center justify-center text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <span className="text-[#3d649e]">Marketing</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#4072b0] flex items-center justify-center text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-[#3d649e]">Estratégia</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#6b91c1] flex items-center justify-center text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <span className="text-[#3d649e]">Consultoria</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-[#3d649e] text-sm">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Termos
          </a>
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-[#6b91c1] transition-colors">
            Configurações
          </a>
        </div>
        <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
        <p className="mt-2">
          Fundada em 2020, a Integrare nasceu com a missão de levar Marketing de Qualidade, baseado em evidências
          científicas e casos práticos de sucesso.
        </p>
      </footer>
    </div>
  )
}
