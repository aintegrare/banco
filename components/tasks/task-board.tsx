"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Loader2, Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "./create-task-dialog"

// Colunas do quadro Kanban
const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "A Fazer" },
  { id: "in-progress", title: "Em Progresso" },
  { id: "review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
]

// Dados de exemplo para tarefas
const SAMPLE_TASKS = [
  {
    id: 1,
    title: "Criar conteúdo para Instagram",
    description: "Desenvolver 10 posts para a campanha de outubro",
    status: "todo",
    projectId: "dr-joel",
    projectName: "Dr. Joel",
    dueDate: "2023-10-25",
    creator: "João Silva",
    assignee: "Ana Silva",
    priority: "medium",
    comments: 3,
    attachments: 2,
    color: "#4b7bb5",
  },
  {
    id: 2,
    title: "Revisar textos do site",
    description: "Revisar e corrigir os textos da página inicial e sobre",
    status: "in-progress",
    projectId: "vanessa-dentista",
    projectName: "Vanessa Dentista",
    dueDate: "2023-10-20",
    creator: "Maria Oliveira",
    assignee: "Carlos Mendes",
    priority: "high",
    comments: 5,
    attachments: 1,
    color: "#e11d48",
  },
  {
    id: 3,
    title: "Preparar relatório mensal",
    description: "Compilar dados e preparar relatório de desempenho",
    status: "review",
    projectId: "integrare",
    projectName: "Integrare",
    dueDate: "2023-10-30",
    creator: "Pedro Santos",
    assignee: "Mariana Costa",
    priority: "medium",
    comments: 2,
    attachments: 3,
    color: "#22c55e",
  },
  {
    id: 4,
    title: "Design de banner promocional",
    description: "Criar banner para campanha de conscientização",
    status: "backlog",
    projectId: "vanessa-cardiologista",
    projectName: "Vanessa Cardiologista",
    dueDate: "2023-11-05",
    creator: "Carla Ferreira",
    assignee: "Pedro Alves",
    priority: "low",
    comments: 0,
    attachments: 0,
    color: "#f97316",
  },
  {
    id: 5,
    title: "Publicar artigo no blog",
    description: "Finalizar e publicar artigo sobre investimentos",
    status: "done",
    projectId: "billions",
    projectName: "Billions",
    dueDate: "2023-10-15",
    creator: "Roberto Lima",
    assignee: "Juliana Martins",
    priority: "high",
    comments: 7,
    attachments: 1,
    color: "#a855f7",
  },
  {
    id: 6,
    title: "Atualizar portfólio",
    description: "Adicionar novos projetos ao portfólio online",
    status: "todo",
    projectId: "mateus-arquiteto",
    projectName: "Mateus Arquiteto",
    dueDate: "2023-10-28",
    creator: "Fernanda Costa",
    assignee: "Rafael Souza",
    priority: "medium",
    comments: 1,
    attachments: 4,
    color: "#db2777",
  },
  {
    id: 7,
    title: "Preparar apresentação para cliente",
    description: "Criar slides para reunião de kickoff",
    status: "in-progress",
    projectId: "eora",
    projectName: "Eora",
    dueDate: "2023-10-22",
    creator: "Lucas Oliveira",
    assignee: "Fernanda Lima",
    priority: "high",
    comments: 4,
    attachments: 2,
    color: "#06b6d4",
  },
  {
    id: 8,
    title: "Revisar contrato",
    description: "Analisar termos do contrato de parceria",
    status: "review",
    projectId: "medeiros-advogados",
    projectName: "Medeiros Advogados",
    dueDate: "2023-10-18",
    creator: "Amanda Rocha",
    assignee: "Bruno Castro",
    priority: "high",
    comments: 6,
    attachments: 3,
    color: "#6b7280",
  },
  {
    id: 9,
    title: "Otimizar SEO do site",
    description: "Implementar melhorias de SEO conforme relatório",
    status: "todo",
    projectId: "plucio",
    projectName: "Plúcio",
    dueDate: "2023-11-10",
    creator: "Thiago Mendes",
    assignee: "Camila Rocha",
    priority: "medium",
    comments: 2,
    attachments: 1,
    color: "#10b981",
  },
  {
    id: 10,
    title: "Reunião de planejamento",
    description: "Preparar pauta e materiais para reunião mensal",
    status: "done",
    projectId: "integrare",
    projectName: "Integrare",
    dueDate: "2023-10-10",
    creator: "Mariana Costa",
    assignee: "Lucas Oliveira",
    priority: "low",
    comments: 8,
    attachments: 5,
    color: "#4f46e5",
  },
]

export function TaskBoard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    // Verificar se há um projeto na URL
    const urlParams = new URLSearchParams(window.location.search)
    const projectParam = urlParams.get("projeto")
    const newTaskParam = urlParams.get("new")

    if (projectParam) {
      setSelectedProject(projectParam)
    }

    // Abrir o diálogo de criação se o parâmetro 'new' estiver presente
    if (newTaskParam === "true") {
      setIsCreateDialogOpen(true)
      // Limpar o parâmetro da URL para evitar que o diálogo abra novamente ao atualizar
      const newUrl = window.location.pathname + (projectParam ? `?projeto=${projectParam}` : "")
      window.history.replaceState({}, "", newUrl)
    }

    // Simular carregamento de dados
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        // Simular chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Filtrar tarefas se houver um projeto selecionado
        if (projectParam) {
          setTasks(SAMPLE_TASKS.filter((task) => task.projectId === projectParam))
        } else {
          setTasks(SAMPLE_TASKS)
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleEditTask = (editedTask: any) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTask.id) {
        return editedTask
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const handleCreateTask = (newTask: any) => {
    // Gerar um ID único para a nova tarefa
    const newId = Math.max(...tasks.map((task) => task.id)) + 1
    const taskWithId = { ...newTask, id: newId }
    setTasks([...tasks, taskWithId])
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Atualizar o status da tarefa
    const updatedTasks = tasks.map((task) => {
      if (task.id === Number(draggableId)) {
        return { ...task, status: destination.droppableId }
      }
      return task
    })

    setTasks(updatedTasks)

    // Aqui você faria uma chamada à API para atualizar o status da tarefa no servidor
    console.log(`Tarefa ${draggableId} movida de ${source.droppableId} para ${destination.droppableId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
      </div>
    )
  }

  // Organizar tarefas por coluna
  const tasksByColumn = COLUMNS.reduce((acc: any, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id)
    return acc
  }, {})

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quadro de Tarefas</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4" style={{ minHeight: "calc(100vh - 150px)" }}>
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80 mx-2 first:ml-0 last:mr-0">
              <div className="bg-gray-100 rounded-lg shadow-sm h-full flex flex-col">
                <div className="p-3 font-medium text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg flex justify-between items-center">
                  <span>{column.title}</span>
                  <span className="bg-white text-gray-600 text-xs font-normal py-1 px-2 rounded-full">
                    {tasksByColumn[column.id].length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-grow p-2 overflow-y-auto"
                      style={{ minHeight: "100px" }}
                    >
                      {tasksByColumn[column.id].map((task: any, index: number) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 last:mb-0"
                            >
                              <TaskCard
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                                showProject={true}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </>
  )
}
