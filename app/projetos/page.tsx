"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Plus, Calendar, Users, BarChart2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

interface Project {
  id: number
  name: string
  description: string | null
  status: string
  progress: number
  color: string
  client: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  members?: any[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Falha ao carregar projetos")
        }
        const data = await response.json()
        setProjects(data || [])
      } catch (error: any) {
        console.error("Erro ao carregar projetos:", error)
        setError(error.message || "Erro ao carregar projetos")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "Em andamento"
      case "concluido":
        return "Concluído"
      case "pausado":
        return "Pausado"
      case "cancelado":
        return "Cancelado"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "bg-blue-100 text-blue-800"
      case "concluido":
        return "bg-green-100 text-green-800"
      case "pausado":
        return "bg-yellow-100 text-yellow-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projetos</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="px-4 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Novo Projeto
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <BarChart2 size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum projeto encontrado</h2>
          <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto.</p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors inline-flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Criar Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/projetos/${project.id}`} key={project.id}>
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                style={{ borderTop: `4px solid ${project.color || "#4b7bb5"}` }}
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{project.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  )}
                  <div className="mt-auto">
                    {project.client && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Cliente:</span> {project.client}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1" />
                      <span>Início: {formatDate(project.start_date)}</span>
                    </div>
                    {project.members && project.members.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        <span>{project.members.length} membros</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#4b7bb5] h-2.5 rounded-full"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{project.progress || 0}% concluído</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateDialog && <CreateProjectDialog onClose={() => setShowCreateDialog(false)} />}
    </div>
  )
}
