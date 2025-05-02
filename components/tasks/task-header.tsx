"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Plus, Search, Menu, X, Home, Filter } from "lucide-react"
import { CreateTaskDialog } from "./create-task-dialog"

// Lista de projetos disponíveis
const PROJECTS = [
  { id: "dr-joel", name: "Dr. Joel" },
  { id: "vanessa-dentista", name: "Vanessa Dentista" },
  { id: "vanessa-cardiologista", name: "Vanessa Cardiologista" },
  { id: "eora", name: "Eora" },
  { id: "medeiros-advogados", name: "Medeiros Advogados" },
  { id: "mateus-arquiteto", name: "Mateus Arquiteto" },
  { id: "billions", name: "Billions" },
  { id: "plucio", name: "Plúcio" },
  { id: "integrare", name: "Integrare" },
]

export function TaskHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Verificar se há um projeto na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const projectParam = urlParams.get("projeto")
    if (projectParam) {
      setSelectedProject(projectParam)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar busca
    console.log("Buscando:", searchQuery)
  }

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
    // Atualizar a URL
    const url = new URL(window.location.href)
    url.searchParams.set("projeto", projectId)
    window.history.pushState({}, "", url.toString())
    // Fechar o filtro
    setIsFilterOpen(false)
  }

  const clearFilter = () => {
    setSelectedProject(null)
    // Remover o parâmetro da URL
    const url = new URL(window.location.href)
    url.searchParams.delete("projeto")
    window.history.pushState({}, "", url.toString())
    // Fechar o filtro
    setIsFilterOpen(false)
  }

  const getSelectedProjectName = () => {
    if (!selectedProject) return null
    const project = PROJECTS.find((p) => p.id === selectedProject)
    return project ? project.name : null
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
              <Link href="/tarefas" className="flex items-center">
                <span className="text-xl font-bold text-[#4072b0]">Tarefas</span>
              </Link>

              {selectedProject && (
                <div className="ml-4 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Projeto:</span>
                  <span className="text-sm font-medium bg-[#4b7bb5] text-white px-2 py-1 rounded-md flex items-center">
                    {getSelectedProjectName()}
                    <button onClick={clearFilter} className="ml-2 text-white hover:text-gray-200">
                      <X size={14} />
                    </button>
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tarefas..."
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Search size={18} />
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filtrar</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-200">
                      Filtrar por Projeto
                    </div>
                    {PROJECTS.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleProjectChange(project.id)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedProject === project.id ? "bg-[#4b7bb5] text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {project.name}
                      </button>
                    ))}
                    {selectedProject && (
                      <button
                        onClick={clearFilter}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200"
                      >
                        Limpar filtro
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Nova Tarefa</span>
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
                  placeholder="Buscar tarefas..."
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
                Projetos
              </Link>
              <Link
                href="/tarefas"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Todas as Tarefas
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

      {isCreateDialogOpen && (
        <CreateTaskDialog onClose={() => setIsCreateDialogOpen(false)} initialProject={selectedProject} />
      )}
    </>
  )
}
