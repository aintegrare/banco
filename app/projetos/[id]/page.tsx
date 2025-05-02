"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ProjectHeader } from "@/components/projects/project-dashboard/project-header"
import { ProjectMetrics } from "@/components/projects/project-dashboard/project-metrics"
import { ProjectTasks } from "@/components/projects/project-dashboard/project-tasks"
import { ProjectKanban } from "@/components/projects/project-dashboard/project-kanban"
import { ProjectTeam } from "@/components/projects/project-dashboard/project-team"
import { ProjectDocuments } from "@/components/projects/project-dashboard/project-documents"

// Dados de exemplo para projetos
const SAMPLE_PROJECTS = [
  {
    id: "dr-joel",
    name: "Dr. Joel",
    description: "Gestão de marketing e comunicação para clínica médica especializada",
    tasksCount: 12,
    membersCount: 4,
    lastUpdated: "2023-10-15",
    progress: 65,
    startDate: "2023-08-01",
    endDate: "2023-12-31",
    status: "Em andamento",
    client: "Joel Mendes",
    budget: "R$ 15.000,00",
    team: [
      { id: "user-1", name: "Ana Silva", role: "Gerente de Projeto", avatar: "AS" },
      { id: "user-2", name: "Carlos Mendes", role: "Designer", avatar: "CM" },
      { id: "user-3", name: "Mariana Costa", role: "Redatora", avatar: "MC" },
      { id: "user-4", name: "Pedro Alves", role: "Social Media", avatar: "PA" },
    ],
  },
  {
    id: "vanessa-dentista",
    name: "Vanessa Dentista",
    description: "Estratégia digital para consultório odontológico",
    tasksCount: 8,
    membersCount: 3,
    lastUpdated: "2023-10-18",
    progress: 40,
    startDate: "2023-09-15",
    endDate: "2024-01-15",
    status: "Em andamento",
    client: "Vanessa Oliveira",
    budget: "R$ 12.000,00",
    team: [
      { id: "user-2", name: "Carlos Mendes", role: "Designer", avatar: "CM" },
      { id: "user-5", name: "Juliana Martins", role: "Gerente de Projeto", avatar: "JM" },
      { id: "user-6", name: "Rafael Souza", role: "Desenvolvedor Web", avatar: "RS" },
    ],
  },
  {
    id: "vanessa-cardiologista",
    name: "Vanessa Cardiologista",
    description: "Comunicação e marketing para cardiologista renomada",
    tasksCount: 10,
    membersCount: 4,
    lastUpdated: "2023-10-12",
    progress: 75,
    startDate: "2023-07-01",
    endDate: "2023-11-30",
    status: "Em andamento",
    client: "Vanessa Cardoso",
    budget: "R$ 18.000,00",
    team: [
      { id: "user-1", name: "Ana Silva", role: "Gerente de Projeto", avatar: "AS" },
      { id: "user-3", name: "Mariana Costa", role: "Redatora", avatar: "MC" },
      { id: "user-7", name: "Fernanda Lima", role: "Designer", avatar: "FL" },
      { id: "user-8", name: "Bruno Castro", role: "Social Media", avatar: "BC" },
    ],
  },
  {
    id: "eora",
    name: "Eora",
    description: "Estratégia de marketing digital para empresa de tecnologia",
    tasksCount: 15,
    membersCount: 5,
    lastUpdated: "2023-10-20",
    progress: 30,
    startDate: "2023-09-01",
    endDate: "2024-03-31",
    status: "Em andamento",
    client: "Eora Tecnologia",
    budget: "R$ 25.000,00",
    team: [
      { id: "user-5", name: "Juliana Martins", role: "Gerente de Projeto", avatar: "JM" },
      { id: "user-6", name: "Rafael Souza", role: "Desenvolvedor Web", avatar: "RS" },
      { id: "user-9", name: "Camila Rocha", role: "UX/UI Designer", avatar: "CR" },
      { id: "user-10", name: "Lucas Oliveira", role: "Analista de Marketing", avatar: "LO" },
      { id: "user-11", name: "Gabriela Santos", role: "Redatora", avatar: "GS" },
    ],
  },
  {
    id: "medeiros-advogados",
    name: "Medeiros Advogados",
    description: "Marketing jurídico para escritório de advocacia",
    tasksCount: 9,
    membersCount: 3,
    lastUpdated: "2023-10-16",
    progress: 50,
    startDate: "2023-08-15",
    endDate: "2024-02-15",
    status: "Em andamento",
    client: "Medeiros & Associados",
    budget: "R$ 20.000,00",
    team: [
      { id: "user-8", name: "Bruno Castro", role: "Gerente de Projeto", avatar: "BC" },
      { id: "user-3", name: "Mariana Costa", role: "Redatora", avatar: "MC" },
      { id: "user-12", name: "Daniel Ferreira", role: "Designer", avatar: "DF" },
    ],
  },
  {
    id: "mateus-arquiteto",
    name: "Mateus Arquiteto",
    description: "Estratégia de comunicação para escritório de arquitetura",
    tasksCount: 7,
    membersCount: 2,
    lastUpdated: "2023-10-19",
    progress: 60,
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    status: "Em andamento",
    client: "Mateus Arquitetura",
    budget: "R$ 10.000,00",
    team: [
      { id: "user-7", name: "Fernanda Lima", role: "Gerente de Projeto", avatar: "FL" },
      { id: "user-9", name: "Camila Rocha", role: "Designer", avatar: "CR" },
    ],
  },
  {
    id: "billions",
    name: "Billions",
    description: "Marketing financeiro para consultoria de investimentos",
    tasksCount: 14,
    membersCount: 4,
    lastUpdated: "2023-10-17",
    progress: 45,
    startDate: "2023-08-01",
    endDate: "2024-01-31",
    status: "Em andamento",
    client: "Billions Investimentos",
    budget: "R$ 22.000,00",
    team: [
      { id: "user-10", name: "Lucas Oliveira", role: "Gerente de Projeto", avatar: "LO" },
      { id: "user-11", name: "Gabriela Santos", role: "Redatora", avatar: "GS" },
      { id: "user-12", name: "Daniel Ferreira", role: "Designer", avatar: "DF" },
      { id: "user-13", name: "Renata Vieira", role: "Analista de Marketing", avatar: "RV" },
    ],
  },
  {
    id: "plucio",
    name: "Plúcio",
    description: "Estratégia digital para empresa de consultoria",
    tasksCount: 11,
    membersCount: 3,
    lastUpdated: "2023-10-14",
    progress: 70,
    startDate: "2023-07-15",
    endDate: "2023-11-15",
    status: "Em andamento",
    client: "Plúcio Consultoria",
    budget: "R$ 16.000,00",
    team: [
      { id: "user-5", name: "Juliana Martins", role: "Gerente de Projeto", avatar: "JM" },
      { id: "user-13", name: "Renata Vieira", role: "Analista de Marketing", avatar: "RV" },
      { id: "user-2", name: "Carlos Mendes", role: "Designer", avatar: "CM" },
    ],
  },
  {
    id: "integrare",
    name: "Integrare",
    description: "Projetos internos da agência Integrare",
    tasksCount: 18,
    membersCount: 6,
    lastUpdated: "2023-10-21",
    progress: 55,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Em andamento",
    client: "Integrare",
    budget: "R$ 30.000,00",
    team: [
      { id: "user-1", name: "Ana Silva", role: "Gerente de Projeto", avatar: "AS" },
      { id: "user-2", name: "Carlos Mendes", role: "Designer", avatar: "CM" },
      { id: "user-3", name: "Mariana Costa", role: "Redatora", avatar: "MC" },
      { id: "user-6", name: "Rafael Souza", role: "Desenvolvedor Web", avatar: "RS" },
      { id: "user-10", name: "Lucas Oliveira", role: "Analista de Marketing", avatar: "LO" },
      { id: "user-11", name: "Gabriela Santos", role: "Redatora", avatar: "GS" },
    ],
  },
]

// Dados de exemplo para tarefas
const SAMPLE_TASKS = [
  {
    id: "task-1",
    title: "Criar conteúdo para Instagram",
    description: "Desenvolver 10 posts para a campanha de outubro",
    status: "todo",
    projectId: "dr-joel",
    projectName: "Dr. Joel",
    dueDate: "2023-10-25",
    assignee: "Ana Silva",
    assigneeId: "user-1",
    priority: "alta",
    comments: 3,
    attachments: 2,
    createdAt: "2023-10-10",
  },
  {
    id: "task-2",
    title: "Revisar textos do site",
    description: "Revisar e corrigir os textos da página inicial e sobre",
    status: "in-progress",
    projectId: "vanessa-dentista",
    projectName: "Vanessa Dentista",
    dueDate: "2023-10-20",
    assignee: "Carlos Mendes",
    assigneeId: "user-2",
    priority: "média",
    comments: 5,
    attachments: 1,
    createdAt: "2023-10-05",
  },
  {
    id: "task-3",
    title: "Preparar relatório mensal",
    description: "Compilar dados e preparar relatório de desempenho",
    status: "review",
    projectId: "integrare",
    projectName: "Integrare",
    dueDate: "2023-10-30",
    assignee: "Mariana Costa",
    assigneeId: "user-3",
    priority: "média",
    comments: 2,
    attachments: 3,
    createdAt: "2023-10-15",
  },
  {
    id: "task-4",
    title: "Design de banner promocional",
    description: "Criar banner para campanha de conscientização",
    status: "backlog",
    projectId: "vanessa-cardiologista",
    projectName: "Vanessa Cardiologista",
    dueDate: "2023-11-05",
    assignee: "Pedro Alves",
    assigneeId: "user-4",
    priority: "baixa",
    comments: 0,
    attachments: 0,
    createdAt: "2023-10-18",
  },
  {
    id: "task-5",
    title: "Publicar artigo no blog",
    description: "Finalizar e publicar artigo sobre investimentos",
    status: "done",
    projectId: "billions",
    projectName: "Billions",
    dueDate: "2023-10-15",
    assignee: "Juliana Martins",
    assigneeId: "user-5",
    priority: "alta",
    comments: 7,
    attachments: 1,
    createdAt: "2023-10-01",
  },
  {
    id: "task-6",
    title: "Atualizar portfólio",
    description: "Adicionar novos projetos ao portfólio online",
    status: "todo",
    projectId: "mateus-arquiteto",
    projectName: "Mateus Arquiteto",
    dueDate: "2023-10-28",
    assignee: "Rafael Souza",
    assigneeId: "user-6",
    priority: "média",
    comments: 1,
    attachments: 4,
    createdAt: "2023-10-12",
  },
  {
    id: "task-7",
    title: "Preparar apresentação para cliente",
    description: "Criar slides para reunião de kickoff",
    status: "in-progress",
    projectId: "eora",
    projectName: "Eora",
    dueDate: "2023-10-22",
    assignee: "Fernanda Lima",
    assigneeId: "user-7",
    priority: "alta",
    comments: 4,
    attachments: 2,
    createdAt: "2023-10-08",
  },
  {
    id: "task-8",
    title: "Revisar contrato",
    description: "Analisar termos do contrato de parceria",
    status: "review",
    projectId: "medeiros-advogados",
    projectName: "Medeiros Advogados",
    dueDate: "2023-10-18",
    assignee: "Bruno Castro",
    assigneeId: "user-8",
    priority: "alta",
    comments: 6,
    attachments: 3,
    createdAt: "2023-10-03",
  },
  {
    id: "task-9",
    title: "Otimizar SEO do site",
    description: "Implementar melhorias de SEO conforme relatório",
    status: "todo",
    projectId: "plucio",
    projectName: "Plúcio",
    dueDate: "2023-11-10",
    assignee: "Camila Rocha",
    assigneeId: "user-9",
    priority: "média",
    comments: 2,
    attachments: 1,
    createdAt: "2023-10-17",
  },
  {
    id: "task-10",
    title: "Reunião de planejamento",
    description: "Preparar pauta e materiais para reunião mensal",
    status: "done",
    projectId: "integrare",
    projectName: "Integrare",
    dueDate: "2023-10-10",
    assignee: "Lucas Oliveira",
    assigneeId: "user-10",
    priority: "média",
    comments: 8,
    attachments: 5,
    createdAt: "2023-09-25",
  },
  {
    id: "task-11",
    title: "Criar campanha de email marketing",
    description: "Desenvolver sequência de emails para novos leads",
    status: "todo",
    projectId: "dr-joel",
    projectName: "Dr. Joel",
    dueDate: "2023-11-02",
    assignee: "Gabriela Santos",
    assigneeId: "user-11",
    priority: "alta",
    comments: 3,
    attachments: 2,
    createdAt: "2023-10-19",
  },
  {
    id: "task-12",
    title: "Redesign da logo",
    description: "Atualizar a identidade visual conforme briefing",
    status: "in-progress",
    projectId: "vanessa-dentista",
    projectName: "Vanessa Dentista",
    dueDate: "2023-10-29",
    assignee: "Daniel Ferreira",
    assigneeId: "user-12",
    priority: "média",
    comments: 4,
    attachments: 3,
    createdAt: "2023-10-14",
  },
  {
    id: "task-13",
    title: "Análise de concorrentes",
    description: "Realizar benchmark dos principais concorrentes",
    status: "backlog",
    projectId: "vanessa-cardiologista",
    projectName: "Vanessa Cardiologista",
    dueDate: "2023-11-15",
    assignee: "Renata Vieira",
    assigneeId: "user-13",
    priority: "baixa",
    comments: 1,
    attachments: 0,
    createdAt: "2023-10-20",
  },
  {
    id: "task-14",
    title: "Configurar Google Analytics",
    description: "Implementar e configurar métricas de acompanhamento",
    status: "review",
    projectId: "eora",
    projectName: "Eora",
    dueDate: "2023-10-24",
    assignee: "Ana Silva",
    assigneeId: "user-1",
    priority: "média",
    comments: 2,
    attachments: 1,
    createdAt: "2023-10-11",
  },
  {
    id: "task-15",
    title: "Criar manual de marca",
    description: "Desenvolver guia completo de identidade visual",
    status: "todo",
    projectId: "medeiros-advogados",
    projectName: "Medeiros Advogados",
    dueDate: "2023-11-08",
    assignee: "Carlos Mendes",
    assigneeId: "user-2",
    priority: "alta",
    comments: 0,
    attachments: 2,
    createdAt: "2023-10-16",
  },
]

// Dados de exemplo para documentos
const SAMPLE_DOCUMENTS = [
  {
    id: "doc-1",
    name: "Briefing.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Ana Silva",
    uploadedAt: "2023-10-05",
    projectId: "dr-joel",
  },
  {
    id: "doc-2",
    name: "Cronograma.xlsx",
    type: "excel",
    size: "1.8 MB",
    uploadedBy: "Carlos Mendes",
    uploadedAt: "2023-10-08",
    projectId: "dr-joel",
  },
  {
    id: "doc-3",
    name: "Apresentação.pptx",
    type: "powerpoint",
    size: "5.2 MB",
    uploadedBy: "Mariana Costa",
    uploadedAt: "2023-10-12",
    projectId: "dr-joel",
  },
  {
    id: "doc-4",
    name: "Contrato.docx",
    type: "word",
    size: "1.1 MB",
    uploadedBy: "Pedro Alves",
    uploadedAt: "2023-09-28",
    projectId: "dr-joel",
  },
  {
    id: "doc-5",
    name: "Logo.ai",
    type: "illustrator",
    size: "3.7 MB",
    uploadedBy: "Juliana Martins",
    uploadedAt: "2023-10-15",
    projectId: "dr-joel",
  },
]

export default function ProjectDashboard() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    const fetchProjectData = async () => {
      setIsLoading(true)
      try {
        // Simular chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Encontrar o projeto pelo ID
        const foundProject = SAMPLE_PROJECTS.find((p) => p.id === projectId)
        if (!foundProject) {
          router.push("/projetos")
          return
        }

        setProject(foundProject)

        // Filtrar tarefas do projeto
        const projectTasks = SAMPLE_TASKS.filter((task) => task.projectId === projectId)
        setTasks(projectTasks)

        // Filtrar documentos do projeto
        const projectDocuments = SAMPLE_DOCUMENTS.filter((doc) => doc.projectId === projectId)
        setDocuments(projectDocuments)
      } catch (error) {
        console.error("Erro ao carregar dados do projeto:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">Projeto não encontrado</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ProjectHeader project={project} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ProjectMetrics project={project} tasks={tasks} />
          </div>

          <div className="mb-6">
            <ProjectTasks tasks={tasks} />
          </div>

          <div>
            <ProjectKanban tasks={tasks} />
          </div>
        </div>

        <div className="space-y-6">
          <ProjectTeam team={project.team} />
          <ProjectDocuments documents={documents} />
        </div>
      </div>
    </div>
  )
}
