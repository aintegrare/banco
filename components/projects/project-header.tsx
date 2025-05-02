"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Plus, Search, Menu, X, Home } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"

export function ProjectHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar busca
    console.log("Buscando:", searchQuery)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="md:hidden mr-2 text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/projetos" className="flex items-center">
                <span className="text-xl font-bold text-[#4072b0]">Projetos</span>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar projetos..."
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Search size={18} />
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Novo Projeto</span>
              </button>
              <Link href="/" className="text-gray-600 hover:text-[#4b7bb5]">
                <Home size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar projetos..."
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <nav className="space-y-1">
              <Link
                href="/projetos"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Todos os Projetos
              </Link>
              <Link
                href="/tarefas"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Tarefas
              </Link>
              <Link
                href="/drive"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Drive
              </Link>
            </nav>
          </div>
        </div>
      )}

      {isCreateDialogOpen && <CreateProjectDialog onClose={() => setIsCreateDialogOpen(false)} />}
    </>
  )
}
