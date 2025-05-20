"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Filter, Search } from "lucide-react"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Colunas do quadro Kanban
const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "A Fazer" },
  { id: "in-progress", title: "Em Progresso" },
  { id: "review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
]

interface TasksKanbanViewProps {
  tasks: any[]
  onTaskEdit: (taskId: string | number) => void
  onTaskStatusChange: (taskId: string | number, newStatus: string) => void
  onTaskUpdated: (task: any) => void
  projects: any[]
}

export function TasksKanbanView({
  tasks = [],
  onTaskEdit = () => {},
  onTaskStatusChange = () => {},
  onTaskUpdated = () => {},
  projects = [],
}: TasksKanbanViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Função segura para obter o nome do projeto
  const safeGetProjectName = (projectId: any): string => {
    // Se projectId for null, undefined ou inválido
    if (projectId == null) {
      return "Sem projeto"
    }

    try {
      // Tenta encontrar o projeto pelo ID
      const projectIdStr = String(projectId)
      const project = projects.find((p) => p && p.id && String(p.id) === projectIdStr)

      // Se encontrou o projeto e ele tem um nome, retorna o nome
      if (project && project.name) {
        return project.name
      }

      // Caso contrário, retorna um valor padrão
      return "Projeto Desconhecido"
    } catch (error) {
      console.error("Erro ao obter nome do projeto:", error)
      return "Erro ao obter projeto"
    }
  }

  // Filtrar tarefas com verificações de segurança
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false

    // Filtro de texto
    const title = task.title || ""
    const description = task.description || ""
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de projeto com verificação de segurança
    let matchesProject = projectFilter === "all"
    if (projectFilter !== "all" && task.project_id != null) {
      try {
        matchesProject = String(task.project_id) === projectFilter
      } catch (e) {
        console.error("Erro ao comparar project_id:", e)
      }
    }

    // Filtro de prioridade
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesProject && matchesPriority
  })

  // Organizar tarefas por coluna com verificações de segurança
  const tasksByColumn = COLUMNS.reduce((acc: any, column) => {
    acc[column.id] = filteredTasks.filter((task) => task && task.status === column.id)
    return acc
  }, {})

  const handleEditTask = (taskId: number | string) => {
    console.log("Editando tarefa no Kanban:", taskId)
    if (taskId) {
      onTaskEdit(taskId)
    }
  }

  const handleDeleteTask = (taskId: number) => {
    console.log("Deletar tarefa:", taskId)
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    if (taskId && newStatus) {
      onTaskStatusChange(taskId, newStatus)
    }
  }

  const onDragEnd = (result: any) => {
    if (!result) return

    const { destination, source, draggableId } = result

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Atualizar o status da tarefa
    if (draggableId) {
      onTaskStatusChange(draggableId, destination.droppableId)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>
          <div className={`flex-col sm:flex-row gap-2 ${showFilters ? "flex" : "hidden md:flex"} w-full md:w-auto`}>
            <div className="w-full sm:w-40">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os projetos</SelectItem>
                  {projects.filter(Boolean).map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name || "Projeto sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto pb-4 p-4 h-full" style={{ minHeight: "calc(100vh - 300px)" }}>
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80 mx-2 first:ml-0 last:mr-0">
              <div className="bg-gray-100 rounded-lg shadow-sm h-full flex flex-col">
                <div className="p-3 font-medium text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg flex justify-between items-center">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="bg-white text-gray-600">
                    {(tasksByColumn[column.id] || []).length}
                  </Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-grow p-2 overflow-y-auto"
                      style={{ minHeight: "100px" }}
                    >
                      {(tasksByColumn[column.id] || []).map((task: any, index: number) => {
                        if (!task || !task.id) return null

                        return (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 last:mb-0"
                                onClick={(e) => {
                                  // Impedir que o evento de clique se propague para o draggable
                                  e.stopPropagation()
                                }}
                              >
                                <TaskCard
                                  task={{
                                    ...task,
                                    projectName: safeGetProjectName(task.project_id),
                                  }}
                                  onEdit={() => handleEditTask(task.id)}
                                  onDelete={handleDeleteTask}
                                  onStatusChange={handleStatusChange}
                                  showProject={true}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
