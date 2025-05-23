"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, Plus, Search, ClipboardList, Grid, List, Filter, Columns } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ProjectTaskNav } from "@/components/shared/ProjectTaskNav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TASK_STATUS, PRIORITY, type TaskFilters } from "@/lib/types"
import { useSimpleTasks } from "@/hooks/use-simple-tasks"
import { CompleteKanbanSystem } from "@/components/tasks/complete-kanban-system"

interface Task {
  id: string | number
  title: string
  description?: string
  status: string
  priority: string
  project_id: string | number | null
  assignee?: string
  due_date?: string
}

interface Project {
  id: string | number
  name: string
}

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectIdParam = searchParams.get("projeto")

  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>({ status: "", priority: "", project_id: undefined })
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid" | "byProject" | "kanban">("list")
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()
  const {
    tasks: simpleTasks,
    isLoading: simpleTasksLoading,
    error: simpleTasksError,
  } = useSimpleTasks(projectIdParam ? Number.parseInt(projectIdParam) : undefined)

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof TaskFilters] !== undefined &&
      filters[key as keyof TaskFilters] !== null &&
      filters[key as keyof TaskFilters] !== "",
  ).length

  // Atualizar a URL quando o filtro de projeto mudar
  useEffect(() => {
    if (filters.project_id !== undefined && filters.project_id !== null) {
      router.push(`/tarefas?projeto=${filters.project_id}`)
    } else if (projectIdParam) {
      router.push("/tarefas")
    }
  }, [filters.project_id, router, projectIdParam])

  // Buscar tarefas e projetos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Buscar projetos
        const projectsResponse = await fetch("/api/projects")
        if (!projectsResponse.ok) {
          throw new Error("Falha ao buscar projetos")
        }
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)

        // Buscar tarefas
        let url = "/api/tasks"
        if (projectIdParam) {
          url += `?project_id=${projectIdParam}`
        }

        console.log("Buscando tarefas de:", url)
        const tasksResponse = await fetch(url)
        if (!tasksResponse.ok) {
          throw new Error("Falha ao buscar tarefas")
        }
        const tasksData = await tasksResponse.json()
        console.log("Tarefas carregadas:", tasksData)

        // Garantir que tasks seja sempre um array
        if (Array.isArray(tasksData)) {
          setTasks(tasksData)
        } else if (tasksData && tasksData.data && Array.isArray(tasksData.data)) {
          setTasks(tasksData.data)
        } else {
          console.error("Formato de resposta inesperado:", tasksData)
          setTasks([])
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados: " + error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectIdParam, toast])

  // Adicione esta função após o useEffect de busca
  useEffect(() => {
    // Se não houver tarefas após o carregamento e não estiver mais carregando,
    // use dados de exemplo para garantir que algo seja exibido
    if (!isLoading && tasks.length === 0) {
      console.log("Usando dados de exemplo para tarefas")
      // Dados de exemplo para garantir que algo seja exibido
      const exampleTasks = [
        {
          id: "example-1",
          title: "Revisar conteúdo do site",
          description: "Verificar textos e imagens da página inicial",
          status: "todo",
          priority: "high",
          project_id: "example",
          due_date: new Date().toISOString(),
        },
        {
          id: "example-2",
          title: "Preparar relatório mensal",
          description: "Compilar métricas de desempenho para o cliente",
          status: "in-progress",
          priority: "medium",
          project_id: "example",
          due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        },
      ]
      setTasks(exampleTasks)
    }
  }, [isLoading, tasks.length])

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    // Filtro de texto - Corrigido para lidar com valores undefined
    const matchesSearch =
      searchTerm === "" ||
      (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro de status
    const matchesStatus =
      filters.status === undefined || filters.status.length === 0 || filters.status.includes(task.status)

    // Filtro de projeto
    const matchesProject =
      filters.project_id === undefined || (task.project_id != null && task.project_id === filters.project_id)

    // Filtro de prioridade
    const matchesPriority =
      filters.priority === undefined || filters.priority.length === 0 || filters.priority.includes(task.priority)

    return matchesSearch && matchesStatus && matchesProject && matchesPriority
  })

  // Agrupar tarefas por projeto para a visualização por projeto
  const tasksByProject = filteredTasks.reduce(
    (acc, task) => {
      const projectId = task.project_id != null ? task.project_id.toString() : "sem-projeto"
      if (!acc[projectId]) {
        acc[projectId] = []
      }
      acc[projectId].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "backlog":
        return "Backlog"
      case "todo":
        return "A Fazer"
      case "in-progress":
        return "Em Progresso"
      case "review":
        return "Em Revisão"
      case "done":
        return "Concluído"
      default:
        return status
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
      case "urgent":
        return "Urgente"
      default:
        return priority
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-green-500"
      case "urgent":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-500"
      case "todo":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "review":
        return "bg-purple-500"
      case "done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sem data"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks])
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!",
    })
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!",
    })
  }

  const getProjectName = (projectId: string | number | null) => {
    if (projectId == null) return "Projeto Desconhecido"
    const project = projects.find((p) => p.id.toString() === projectId.toString())
    return project ? project.name : "Projeto Desconhecido"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectTaskNav />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tarefas</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              title="Visualização em lista"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              title="Visualização em grade"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("byProject")}
              className={`p-2 rounded-md ${viewMode === "byProject" ? "bg-white shadow-sm" : ""}`}
              title="Visualização por projeto"
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-md ${viewMode === "kanban" ? "bg-white shadow-sm" : ""}`}
              title="Visualização Kanban"
            >
              <Columns size={18} />
            </button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <Plus size={16} className="mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 ${viewMode === "kanban" ? "p-0" : ""}`}
      >
        {viewMode !== "kanban" && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleFilterChange("search", e.target.value || undefined)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <Filter size={16} className="mr-2" />
                Filtros
              </Button>
              <div className={`flex-col sm:flex-row gap-2 ${showFilters ? "flex" : "hidden md:flex"}`}>
                <div className="w-full sm:w-40">
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value={TASK_STATUS.BACKLOG}>Backlog</SelectItem>
                      <SelectItem value={TASK_STATUS.TODO}>A Fazer</SelectItem>
                      <SelectItem value={TASK_STATUS.IN_PROGRESS}>Em Progresso</SelectItem>
                      <SelectItem value={TASK_STATUS.REVIEW}>Em Revisão</SelectItem>
                      <SelectItem value={TASK_STATUS.DONE}>Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-40">
                  <Select
                    value={filters.priority || "all"}
                    onValueChange={(value) => handleFilterChange("priority", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as prioridades</SelectItem>
                      <SelectItem value={PRIORITY.LOW}>Baixa</SelectItem>
                      <SelectItem value={PRIORITY.MEDIUM}>Média</SelectItem>
                      <SelectItem value={PRIORITY.HIGH}>Alta</SelectItem>
                      <SelectItem value={PRIORITY.URGENT}>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Select
                    value={filters.project_id?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("project_id", value === "all" ? undefined : Number.parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os projetos</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtro por projeto */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="project-filter" className="text-sm font-medium text-gray-700">
            Filtrar por projeto:
          </label>
          <select
            id="project-filter"
            value={projectIdParam || ""}
            onChange={(e) => router.push(`/tarefas?projeto=${e.target.value}`)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={simpleTasksLoading}
          >
            <option value="">Todos os projetos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>

          {projectIdParam && (
            <button onClick={() => router.push(`/tarefas`)} className="text-sm text-gray-500 hover:text-gray-700">
              ❌ Limpar filtro
            </button>
          )}
        </div>

        {/* Status */}
        {simpleTasksLoading && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600">Carregando tarefas...</p>
          </div>
        )}

        {simpleTasksError && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">Erro: {simpleTasksError}</p>
          </div>
        )}

        {!simpleTasksLoading && !simpleTasksError && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-600">
              {simpleTasks.length} tarefas carregadas
              {projectIdParam ? ` para o projeto ${projectIdParam}` : ""}
            </p>
          </div>
        )}

        {simpleTasksLoading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 size={30} className="text-[#4b7bb5] animate-spin mb-4" />
            <p className="text-gray-500">Carregando suas tarefas...</p>
          </div>
        ) : simpleTasks.length > 0 ? (
          <>
            {/* Visualização Kanban */}
            {viewMode === "kanban" && (
              <CompleteKanbanSystem projectId={projectIdParam ? Number.parseInt(projectIdParam) : undefined} />
            )}

            {/* Visualização em Lista */}
            {viewMode === "list" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Título</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Prioridade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Projeto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Responsável</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simpleTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setEditTaskId(task.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{task.title || "Sem título"}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{task.description || ""}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`}></div>
                            <span>{getStatusLabel(task.status)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-2`}></div>
                            <span>{getPriorityLabel(task.priority)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {task.project_id != null
                            ? projects.find((p) => p.id.toString() === task.project_id?.toString())?.name || "Projeto"
                            : "Sem projeto"}
                        </td>
                        <td className="py-3 px-4">{task.assignee || "Não atribuído"}</td>
                        <td className="py-3 px-4">{formatDate(task.due_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Visualização em Grade */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simpleTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setEditTaskId(task.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{task.title || "Sem título"}</CardTitle>
                        <Badge
                          className={getPriorityColor(task.priority)
                            .replace("bg-", "bg-opacity-20 text-")
                            .replace("500", "700")}
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{task.description || ""}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className="text-sm font-medium flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`}></div>
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Projeto:</span>
                          <span className="text-sm font-medium">
                            {task.project_id != null
                              ? projects.find((p) => p.id.toString() === task.project_id?.toString())?.name || "Projeto"
                              : "Sem projeto"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Data:</span>
                          <span className="text-sm font-medium">{formatDate(task.due_date)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <span className="text-sm text-gray-500">Responsável: {task.assignee || "Não atribuído"}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Visualização por Projeto */}
            {viewMode === "byProject" && (
              <div className="space-y-8">
                {Object.entries(tasksByProject).map(([projectId, projectTasks]) => (
                  <div key={projectId} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-medium text-lg">
                        {projectId === "sem-projeto" ? "Tarefas sem projeto" : getProjectName(projectId)}
                        <span className="ml-2 text-sm text-gray-500">({projectTasks.length} tarefas)</span>
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Título</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Prioridade</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Responsável</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectTasks.map((task) => (
                            <tr
                              key={task.id}
                              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                              onClick={() => setEditTaskId(task.id)}
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium text-gray-800">{task.title || "Sem título"}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{task.description || ""}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`}></div>
                                  <span>{getStatusLabel(task.status)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-2`}></div>
                                  <span>{getPriorityLabel(task.priority)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{task.assignee || "Não atribuído"}</td>
                              <td className="py-3 px-4">{formatDate(task.due_date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4 text-gray-400">
              <ClipboardList size={48} className="mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || activeFiltersCount > 0
                ? "Tente ajustar os filtros para ver mais resultados"
                : "Comece criando sua primeira tarefa"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              <Plus size={16} className="mr-2" />
              Nova Tarefa
            </Button>
          </div>
        )}
      </div>

      {/* Diálogo de criação de tarefa */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        initialProject={filters.project_id !== undefined ? filters.project_id : null}
        onTaskCreated={handleTaskCreated}
      />

      {/* Diálogo de edição de tarefa */}
      {editTaskId && (
        <EditTaskDialog
          isOpen={!!editTaskId}
          onClose={() => setEditTaskId(null)}
          taskId={editTaskId}
          onSave={handleTaskUpdated}
        />
      )}
    </div>
  )
}
