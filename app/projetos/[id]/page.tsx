"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { ProjectHeader } from "@/components/projects/project-dashboard/project-header"
import { ProjectMetrics } from "@/components/projects/project-dashboard/project-metrics"
import { ProjectTasks } from "@/components/projects/project-dashboard/project-tasks"
import { ProjectKanban } from "@/components/projects/project-dashboard/project-kanban"
import { ProjectTeam } from "@/components/projects/project-dashboard/project-team"
import { ProjectDocuments } from "@/components/projects/project-dashboard/project-documents"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectDashboard() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const fetchProjectData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log(`Buscando projeto: ${projectId}`)
      // Buscar dados do projeto do banco de dados
      const projectResponse = await fetch(`/api/projects/${projectId}`)

      console.log(`Status da resposta: ${projectResponse.status}`)

      if (!projectResponse.ok) {
        if (projectResponse.status === 404) {
          throw new Error("Projeto não encontrado")
        } else {
          const errorData = await projectResponse.json()
          throw new Error(errorData.error || "Erro ao buscar projeto")
        }
      }

      const projectData = await projectResponse.json()
      console.log("Dados do projeto recebidos:", projectData)

      if (!projectData || !projectData.id) {
        throw new Error("Dados do projeto inválidos")
      }

      setProject(projectData)

      // Buscar tarefas do projeto
      try {
        console.log(`Buscando tarefas para o projeto ${projectData.id}`)
        const tasksResponse = await fetch(`/api/tasks?projectId=${projectData.id}`)

        if (!tasksResponse.ok) {
          console.warn(`Erro ao buscar tarefas: ${tasksResponse.status}`)
          setTasks([])
          return
        }

        const responseText = await tasksResponse.text()

        // Verificar se a resposta é JSON válido
        try {
          const tasksData = JSON.parse(responseText)
          console.log("Tarefas carregadas:", tasksData)
          setTasks(Array.isArray(tasksData) ? tasksData : [])
        } catch (parseError) {
          console.error("Erro ao analisar resposta JSON de tarefas:", parseError)
          console.error("Resposta recebida:", responseText.substring(0, 100) + "...")
          setTasks([])
        }
      } catch (taskError) {
        console.error("Erro ao carregar tarefas:", taskError)
        setTasks([])
      }

      // Buscar documentos do projeto
      try {
        const documentsResponse = await fetch(`/api/documents?projectId=${projectData.id}`)

        if (!documentsResponse.ok) {
          console.warn("Não foi possível carregar os documentos")
          setDocuments([])
          return
        }

        const responseText = await documentsResponse.text()

        // Verificar se a resposta é JSON válido
        try {
          const documentsData = JSON.parse(responseText)
          setDocuments(Array.isArray(documentsData) ? documentsData : [])
        } catch (parseError) {
          console.error("Erro ao analisar resposta JSON de documentos:", parseError)
          setDocuments([])
        }
      } catch (docError) {
        console.error("Erro ao carregar documentos:", docError)
        setDocuments([])
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados do projeto:", error)
      setError(error.message || "Erro ao carregar o projeto")
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os dados do projeto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [projectId, toast])

  const createProject = async () => {
    setIsCreating(true)
    try {
      // Extrair um nome de projeto do slug
      const projectName = projectId
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: "Projeto criado automaticamente",
          status: "em_andamento",
          color: "#4b7bb5",
          start_date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar o projeto")
      }

      const newProject = await response.json()
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      })

      // Redirecionar para o novo projeto
      router.push(`/projetos/${newProject.id}`)
    } catch (error: any) {
      console.error("Erro ao criar projeto:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o projeto.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, fetchProjectData])

  const handleProjectUpdate = () => {
    fetchProjectData()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Projeto não encontrado</CardTitle>
            <CardDescription>
              Não foi possível encontrar o projeto "{projectId.toString().replace(/-/g, " ")}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              {error || "O projeto que você está procurando não existe ou foi removido."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/projetos")}>
              Voltar para Projetos
            </Button>
            <Button onClick={createProject} disabled={isCreating} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Projeto
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ProjectHeader project={project} onProjectUpdate={handleProjectUpdate} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ProjectMetrics project={project} tasks={tasks} />
          </div>

          <div className="mb-6">
            <ProjectTasks tasks={tasks} projectId={project.id} />
          </div>

          <div>
            <ProjectKanban tasks={tasks} projectId={project.id} />
          </div>
        </div>

        <div className="space-y-6">
          <ProjectTeam team={project.members || []} />
          <ProjectDocuments documents={documents} />
        </div>
      </div>
    </div>
  )
}
