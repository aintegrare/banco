"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"

interface ProjectHeaderProps {
  project: any
  onProjectUpdate?: () => void
}

export function ProjectHeader({ project, onProjectUpdate }: ProjectHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não definida"
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "Data inválida"
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      planejamento: "Planejamento",
      em_andamento: "Em andamento",
      pausado: "Pausado",
      concluido: "Concluído",
      cancelado: "Cancelado",
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      planejamento: "bg-blue-100 text-blue-800",
      em_andamento: "bg-green-100 text-green-800",
      pausado: "bg-yellow-100 text-yellow-800",
      concluido: "bg-purple-100 text-purple-800",
      cancelado: "bg-red-100 text-red-800",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <div className="flex items-center mb-2">
            <Link href="/projetos" className="text-gray-500 hover:text-gray-700 mr-2">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          </div>

          <p className="text-gray-600 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>

            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-1" />
              <span>
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-1" />
              <span>{project.members?.length || 0} membros</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} data-testid="edit-project-button">
            <Edit size={16} className="mr-2" />
            Editar Projeto
          </Button>
        </div>
      </div>

      <EditProjectDialog
        project={project}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={() => {
          if (onProjectUpdate) onProjectUpdate()
        }}
      />
    </>
  )
}
