"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { ProjectCard } from "./project-card"

// Lista de projetos disponíveis
const PROJECTS = [
  {
    id: "dr-joel",
    name: "Dr. Joel",
    description: "Projeto de marketing digital para clínica médica",
    tasksCount: 12,
    membersCount: 3,
    lastUpdated: "2023-10-15T14:30:00Z",
  },
  {
    id: "vanessa-dentista",
    name: "Vanessa Dentista",
    description: "Estratégia de conteúdo para consultório odontológico",
    tasksCount: 8,
    membersCount: 2,
    lastUpdated: "2023-10-18T09:15:00Z",
  },
  {
    id: "vanessa-cardiologista",
    name: "Vanessa Cardiologista",
    description: "Campanha de conscientização sobre saúde cardíaca",
    tasksCount: 15,
    membersCount: 4,
    lastUpdated: "2023-10-20T11:45:00Z",
  },
  {
    id: "eora",
    name: "Eora",
    description: "Lançamento de produto sustentável",
    tasksCount: 20,
    membersCount: 5,
    lastUpdated: "2023-10-17T16:20:00Z",
  },
  {
    id: "medeiros-advogados",
    name: "Medeiros Advogados",
    description: "Rebranding e posicionamento digital",
    tasksCount: 10,
    membersCount: 3,
    lastUpdated: "2023-10-19T10:05:00Z",
  },
  {
    id: "mateus-arquiteto",
    name: "Mateus Arquiteto",
    description: "Portfolio digital e estratégia de captação",
    tasksCount: 7,
    membersCount: 2,
    lastUpdated: "2023-10-16T13:40:00Z",
  },
  {
    id: "billions",
    name: "Billions",
    description: "Campanha de marketing para investimentos",
    tasksCount: 18,
    membersCount: 4,
    lastUpdated: "2023-10-14T15:10:00Z",
  },
  {
    id: "plucio",
    name: "Plúcio",
    description: "Estratégia de conteúdo e SEO",
    tasksCount: 9,
    membersCount: 3,
    lastUpdated: "2023-10-13T09:30:00Z",
  },
  {
    id: "integrare",
    name: "Integrare",
    description: "Projetos internos da agência",
    tasksCount: 25,
    membersCount: 8,
    lastUpdated: "2023-10-21T14:00:00Z",
  },
]

export function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        // Simular chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProjects(PROJECTS)
      } catch (error) {
        console.error("Erro ao carregar projetos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects && projects.length > 0 ? (
        projects.map((project) => <ProjectCard key={project.id} project={project} />)
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Nenhum projeto encontrado.</p>
        </div>
      )}
    </div>
  )
}
