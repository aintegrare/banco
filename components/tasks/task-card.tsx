"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditTaskDialog } from "./edit-task-dialog"
import { DeleteTaskConfirmation } from "./delete-task-confirmation"
import { TaskStatusBadge } from "./task-status-badge"

// Lista de projetos disponíveis para simulação
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

interface TaskCardProps {
  task: any
  onEdit: (task: any) => void
  onDelete: (id: number) => void
  onStatusChange?: (id: number, status: string) => void
  showProject?: boolean
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, showProject = false }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const handleStatusChange = (status: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, status)
    }
  }

  const handleEditSave = (editedTask: any) => {
    onEdit(editedTask)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Impedir que o evento de clique se propague para elementos pai
    e.stopPropagation()
    // Abrir o diálogo de edição
    setIsEditDialogOpen(true)
  }

  const cardStyle = {
    borderLeft: task.color ? `4px solid ${task.color}` : `4px solid #4b7bb5`,
  }

  return (
    <>
      <Card
        className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        style={cardStyle}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div
              className="text-lg font-medium text-[#4b7bb5] hover:text-[#3d649e] transition-colors duration-200 flex-1"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditDialogOpen(true)
              }}
            >
              {task.title}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Editar</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  Excluir
                </DropdownMenuItem>
                {onStatusChange && (
                  <>
                    <DropdownMenuItem onClick={() => handleStatusChange("todo")}>Mover para A Fazer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                      Mover para Em Progresso
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("review")}>
                      Mover para Em Revisão
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("done")}>Mover para Concluído</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>}

          <div className="flex flex-wrap gap-2 mb-3">
            <TaskStatusBadge status={task.status} size="sm" />
            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
              {getPriorityLabel(task.priority)}
            </Badge>
            {showProject && (
              <Badge variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                {task.projectName}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {task.dueDate ? (
                <span>{format(new Date(task.dueDate), "dd MMM yyyy", { locale: ptBR })}</span>
              ) : (
                <span>Sem data</span>
              )}
            </div>

            <div className="flex items-center">
              {task.comments > 0 && (
                <div className="text-xs text-gray-500 mr-2">
                  {task.comments} comentário{task.comments !== 1 ? "s" : ""}
                </div>
              )}

              <div className="flex items-center">
                {task.creator && (
                  <div className="text-xs text-gray-500 mr-2" title={`Criado por: ${task.creator}`}>
                    De: {task.creator.split(" ")[0]}
                  </div>
                )}
                {task.assignee && (
                  <div className="flex items-center" title={`Responsável: ${task.assignee}`}>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-[#4b7bb5] text-white">{task.assignee.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        taskId={task.id}
        onSave={handleEditSave}
      />

      <DeleteTaskConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDelete(task.id)}
        taskTitle={task.title}
      />
    </>
  )
}
