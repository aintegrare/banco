import { CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import type React from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  FileText,
  FolderKanban,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileImage,
  CheckSquare,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Dados de exemplo para o dashboard
  const stats = [
    {
      title: "Clientes",
      value: "24",
      description: "Total de clientes ativos",
      icon: <Users className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/clientes",
    },
    {
      title: "Projetos",
      value: "12",
      description: "Projetos em andamento",
      icon: <FolderKanban className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/projetos",
    },
    {
      title: "Tarefas",
      value: "48",
      description: "Tarefas pendentes",
      icon: <CheckSquare className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/tarefas",
    },
    {
      title: "Documentos",
      value: "156",
      description: "Documentos armazenados",
      icon: <FileText className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/documentos",
    },
    {
      title: "Relatórios",
      value: "8",
      description: "Relatórios disponíveis",
      icon: <BarChart3 className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/relatorios",
    },
    {
      title: "Agenda",
      value: "5",
      description: "Eventos próximos",
      icon: <Calendar className="h-8 w-8 text-[#4b7bb5]" />,
      href: "/admin/agenda",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Dashboard Administrativo" description="Bem-vindo ao painel administrativo da Integrare" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index} className="block">
            <Card className="p-6 hover:shadow-md transition-shadow duration-200 hover:border-[#4b7bb5]/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2 text-[#4b7bb5]">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="bg-[#4b7bb5]/10 p-3 rounded-full">{stat.icon}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6 mt-12">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="calendar">Agenda</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Projetos Ativos"
              value="12"
              icon={<FolderKanban className="h-5 w-5" />}
              change={{ value: "+2", type: "increase" }}
              href="/admin/projetos"
            />
            <StatCard
              title="Tarefas Pendentes"
              value="24"
              icon={<Clock className="h-5 w-5" />}
              change={{ value: "-5", type: "decrease" }}
              href="/admin/tarefas"
            />
            <StatCard
              title="Clientes"
              value="18"
              icon={<Users className="h-5 w-5" />}
              change={{ value: "+1", type: "increase" }}
              href="/admin/clientes"
            />
            <StatCard
              title="Documentos"
              value="156"
              icon={<FileText className="h-5 w-5" />}
              change={{ value: "+12", type: "increase" }}
              href="/admin/arquivos"
            />
          </div>

          {/* Atividades Recentes e Próximos Eventos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#4b7bb5] flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    title="Novo post no blog publicado"
                    description="O post 'Estratégias de Marketing Digital' foi publicado"
                    icon={<FileImage className="h-4 w-4" />}
                    time="Há 2 horas"
                  />
                  <ActivityItem
                    title="Arquivo adicionado"
                    description="presentation-cliente-xyz.pdf foi adicionado à pasta Clientes"
                    icon={<FileText className="h-4 w-4" />}
                    time="Há 5 horas"
                  />
                  <ActivityItem
                    title="Tarefa concluída"
                    description="Revisão do site do cliente ABC finalizada"
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    time="Ontem"
                  />
                  <ActivityItem
                    title="Novo cliente adicionado"
                    description="Empresa XYZ foi adicionada como cliente"
                    icon={<Users className="h-4 w-4" />}
                    time="Há 2 dias"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#4b7bb5] flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <EventItem title="Reunião com Cliente ABC" date="Hoje, 14:00" type="meeting" />
                  <EventItem title="Entrega do Projeto XYZ" date="Amanhã, 18:00" type="deadline" />
                  <EventItem title="Apresentação de Estratégia" date="23/05, 10:00" type="presentation" />
                  <EventItem title="Treinamento da Equipe" date="25/05, 09:00" type="training" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projetos em Destaque e Tarefas Prioritárias */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#4b7bb5] flex items-center">
                  <FolderKanban className="mr-2 h-5 w-5" />
                  Projetos em Destaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ProjectItem title="Redesign Site Cliente ABC" progress={75} dueDate="28/05/2023" />
                  <ProjectItem title="Campanha de Marketing XYZ" progress={45} dueDate="15/06/2023" />
                  <ProjectItem title="Desenvolvimento de App" progress={30} dueDate="30/07/2023" />
                </div>
                <div className="mt-4 text-right">
                  <Link href="/admin/projetos" className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e]">
                    Ver todos os projetos →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#4b7bb5] flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Tarefas Prioritárias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TaskItem title="Finalizar apresentação para cliente" dueDate="Hoje" priority="high" />
                  <TaskItem title="Revisar conteúdo do blog" dueDate="Amanhã" priority="medium" />
                  <TaskItem title="Atualizar relatório mensal" dueDate="23/05" priority="medium" />
                  <TaskItem title="Preparar reunião de equipe" dueDate="25/05" priority="low" />
                </div>
                <div className="mt-4 text-right">
                  <Link href="/admin/tarefas" className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e]">
                    Ver todas as tarefas →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>Gerencie todos os seus projetos em um só lugar.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de projetos...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas</CardTitle>
              <CardDescription>Visualize e gerencie suas tarefas pendentes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de tarefas...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Arquivos</CardTitle>
              <CardDescription>Acesse e gerencie seus arquivos e documentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de arquivos...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Visualize e gerencie seus relatórios.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de relatórios...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
              <CardDescription>Visualize e gerencie sua agenda.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de agenda...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componentes auxiliares
interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  href?: string
}

function StatCard({ title, value, icon, change, href }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-[#4b7bb5]">{icon}</div>
          {href ? (
            <Link href={href} className="text-xs text-gray-500 hover:text-[#4b7bb5]">
              Ver detalhes
            </Link>
          ) : null}
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
        {change && (
          <div className="mt-2 flex items-center text-xs">
            {change.type === "increase" ? (
              <>
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{change.value} desde ontem</span>
              </>
            ) : change.type === "decrease" ? (
              <>
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{change.value} desde ontem</span>
              </>
            ) : (
              <span className="text-gray-500">Sem alteração</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  title: string
  description: string
  icon: React.ReactNode
  time: string
}

function ActivityItem({ title, description, icon, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  )
}

interface EventItemProps {
  title: string
  date: string
  type: "meeting" | "deadline" | "presentation" | "training"
}

function EventItem({ title, date, type }: EventItemProps) {
  const getEventColor = () => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-700"
      case "deadline":
        return "bg-red-100 text-red-700"
      case "presentation":
        return "bg-purple-100 text-purple-700"
      case "training":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex h-10 w-2 rounded ${getEventColor()}`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <div>
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  )
}

interface ProjectItemProps {
  title: string
  progress: number
  dueDate: string
}

function ProjectItem({ title, progress, dueDate }: ProjectItemProps) {
  const getProgressColor = () => {
    if (progress >= 75) return "bg-green-500"
    if (progress >= 40) return "bg-blue-500"
    return "bg-orange-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">Prazo: {dueDate}</p>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${getProgressColor()}`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Progresso</span>
        <span className="font-medium">{progress}%</span>
      </div>
    </div>
  )
}

interface TaskItemProps {
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
}

function TaskItem({ title, dueDate, priority }: TaskItemProps) {
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
        <div className="h-3 w-3 rounded-full"></div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Prazo: {dueDate}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${getPriorityColor()}`}>
            {priority === "high" ? "Alta" : priority === "medium" ? "Média" : "Baixa"}
          </span>
        </div>
      </div>
    </div>
  )
}
