"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  FileText,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  BarChart,
  Target,
  MessageCircle,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  Info,
  FolderOpen,
  Plus,
  Users,
  CalendarIcon,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface WorkspacePanelProps {
  selectedModule: string
  selectedModel: string
  activeTab: string
  isOnline: boolean
  isCompact?: boolean
}

// Interface para projetos
interface Project {
  id: string
  name: string
  client: string
  status: "active" | "completed" | "paused"
  progress: number
  team: {
    id: string
    name: string
    avatar?: string
    role: string
  }[]
  lastUpdated: string
  modules: string[]
  models: string[]
}

export default function WorkspacePanel({
  selectedModule,
  selectedModel,
  activeTab,
  isOnline,
  isCompact = false,
}: WorkspacePanelProps) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("info")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [showDetails, setShowDetails] = useState(!isCompact)

  // Carregar projetos (simulação)
  useEffect(() => {
    // Dados de exemplo para projetos
    const sampleProjects: Project[] = [
      {
        id: "proj1",
        name: "Campanha de Verão",
        client: "Moda Express",
        status: "active",
        progress: 65,
        team: [
          { id: "user1", name: "Ana Silva", role: "Gerente", avatar: "/abstract-geometric-as.png" },
          { id: "user2", name: "Carlos Mendes", role: "Designer", avatar: "/abstract-geometric-cm.png" },
        ],
        lastUpdated: "2023-11-15T14:30:00",
        modules: ["instagram", "facebook"],
        models: ["content-generator", "hashtag-optimizer"],
      },
      {
        id: "proj2",
        name: "Lançamento de Produto",
        client: "Tech Solutions",
        status: "active",
        progress: 40,
        team: [
          { id: "user3", name: "Mariana Costa", role: "Copywriter", avatar: "/microphone-concert-stage.png" },
          { id: "user4", name: "Pedro Alves", role: "Estrategista", avatar: "/paw-print-heart.png" },
        ],
        lastUpdated: "2023-11-18T09:15:00",
        modules: ["linkedin", "twitter"],
        models: ["content-generator", "analytics-assistant"],
      },
      {
        id: "proj3",
        name: "Conteúdo Institucional",
        client: "Banco Nacional",
        status: "paused",
        progress: 80,
        team: [{ id: "user5", name: "Juliana Martins", role: "Gerente", avatar: "/abstract-jm.png" }],
        lastUpdated: "2023-11-10T16:45:00",
        modules: ["linkedin", "facebook"],
        models: ["content-generator"],
      },
    ]

    setProjects(sampleProjects)
    // Selecionar o primeiro projeto por padrão
    if (sampleProjects.length > 0 && !selectedProject) {
      setSelectedProject(sampleProjects[0].id)
    }
  }, [selectedProject])

  // Atualizar visibilidade de detalhes quando o modo compacto mudar
  useEffect(() => {
    setShowDetails(!isCompact)
  }, [isCompact])

  // Informações do módulo selecionado
  const moduleInfo = {
    instagram: {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5 text-[#E1306C]" />,
      description: "Estratégias para engajamento no Instagram",
      metrics: {
        engagement: 78,
        reach: 65,
        conversion: 42,
      },
      bestPractices: [
        "Use hashtags relevantes",
        "Poste Stories diariamente",
        "Interaja com seguidores",
        "Use Reels para maior alcance",
      ],
      recommendedContent: ["Carrosséis", "Reels curtos", "Stories interativos", "Enquetes"],
    },
    facebook: {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5 text-[#4267B2]" />,
      description: "Estratégias para alcance no Facebook",
      metrics: {
        engagement: 62,
        reach: 70,
        conversion: 48,
      },
      bestPractices: [
        "Poste vídeos nativos",
        "Crie eventos",
        "Use grupos para comunidade",
        "Programe posts em horários de pico",
      ],
      recommendedContent: ["Vídeos longos", "Artigos", "Eventos", "Enquetes"],
    },
    twitter: {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />,
      description: "Estratégias para conversação no Twitter",
      metrics: {
        engagement: 85,
        reach: 60,
        conversion: 35,
      },
      bestPractices: [
        "Use hashtags trending",
        "Participe de conversas",
        "Poste frequentemente",
        "Responda menções rapidamente",
      ],
      recommendedContent: ["Threads", "Enquetes", "GIFs", "Tweets curtos e diretos"],
    },
    linkedin: {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5 text-[#0077B5]" />,
      description: "Estratégias para networking profissional",
      metrics: {
        engagement: 58,
        reach: 72,
        conversion: 65,
      },
      bestPractices: [
        "Compartilhe conteúdo do setor",
        "Publique artigos longos",
        "Engaje com sua rede",
        "Use hashtags profissionais",
      ],
      recommendedContent: ["Artigos", "Estudos de caso", "Conquistas profissionais", "Insights do setor"],
    },
  }

  // Informações do modelo selecionado
  const modelInfo = {
    "content-generator": {
      name: "Gerador de Conteúdo",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      description: "Gera conteúdo otimizado para redes sociais",
      capabilities: ["Legendas criativas", "Hashtags relevantes", "Adaptação por plataforma", "Sugestões de imagens"],
      integrations: {
        posts: "Gera legendas e hashtags automaticamente",
        timeline: "Sugere conteúdo para datas específicas",
        mindmap: "Expande ideias e conceitos",
        chat: "Responde perguntas sobre criação de conteúdo",
      },
    },
    "hashtag-optimizer": {
      name: "Otimizador de Hashtags",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      description: "Encontra as melhores hashtags para seu conteúdo",
      capabilities: ["Análise de tendências", "Hashtags por nicho", "Métricas de alcance", "Combinações otimizadas"],
      integrations: {
        posts: "Sugere hashtags relevantes para cada post",
        timeline: "Identifica hashtags sazonais",
        mindmap: "Mapeia relações entre hashtags",
        chat: "Responde perguntas sobre estratégias de hashtags",
      },
    },
    "analytics-assistant": {
      name: "Assistente de Análise",
      icon: <BarChart className="h-5 w-5 text-green-500" />,
      description: "Analisa desempenho e sugere melhorias",
      capabilities: [
        "Métricas de engajamento",
        "Análise de audiência",
        "Comparação de desempenho",
        "Previsões de tendências",
      ],
      integrations: {
        posts: "Analisa desempenho potencial de posts",
        timeline: "Identifica melhores horários para publicação",
        mindmap: "Visualiza relações entre métricas",
        chat: "Responde perguntas sobre análise de dados",
      },
    },
  }

  // Obter informações do módulo e modelo selecionados
  const currentModule = moduleInfo[selectedModule as keyof typeof moduleInfo] || moduleInfo.instagram
  const currentModel = modelInfo[selectedModel as keyof typeof modelInfo] || modelInfo["content-generator"]

  // Obter o projeto selecionado
  const currentProject = projects.find((p) => p.id === selectedProject) || null

  // Obter informações de integração baseadas na aba ativa
  const getIntegrationInfo = () => {
    switch (activeTab) {
      case "posts":
        return {
          title: "Integração com Posts",
          description: "Como os módulos e modelos se integram com seus posts",
          moduleIntegration: "Otimize seus posts para " + currentModule.name,
          modelIntegration: currentModel.integrations.posts,
          icon: <FileText className="h-5 w-5 text-[#4b7bb5]" />,
        }
      case "timeline":
        return {
          title: "Integração com Timeline",
          description: "Como os módulos e modelos se integram com sua timeline",
          moduleIntegration: "Planeje publicações otimizadas para " + currentModule.name,
          modelIntegration: currentModel.integrations.timeline,
          icon: <Calendar className="h-5 w-5 text-[#4b7bb5]" />,
        }
      case "mindmap":
        return {
          title: "Integração com Mindmap",
          description: "Como os módulos e modelos se integram com seu mindmap",
          moduleIntegration: "Visualize estratégias para " + currentModule.name,
          modelIntegration: currentModel.integrations.mindmap,
          icon: <Target className="h-5 w-5 text-[#4b7bb5]" />,
        }
      case "chat":
        return {
          title: "Integração com Chat IA",
          description: "Como os módulos e modelos se integram com o chat",
          moduleIntegration: "Obtenha respostas específicas sobre " + currentModule.name,
          modelIntegration: currentModel.integrations.chat,
          icon: <MessageCircle className="h-5 w-5 text-[#4b7bb5]" />,
        }
      default:
        return {
          title: "Integração",
          description: "Selecione uma aba para ver detalhes de integração",
          moduleIntegration: "",
          modelIntegration: "",
          icon: <Info className="h-5 w-5 text-[#4b7bb5]" />,
        }
    }
  }

  const integrationInfo = getIntegrationInfo()

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Workspace</h2>
          {!isCompact && (
            <Select value={selectedProject || ""} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px] h-8 text-sm mt-2">
                <SelectValue placeholder="Selecionar projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {isCompact ? (
          <Select value={selectedProject || ""} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Selecionar projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Ocultar detalhes" : "Mostrar detalhes"}
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {currentProject && (
        <div className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{currentProject.name}</p>
              <p className="text-xs text-gray-500">Cliente: {currentProject.client}</p>
            </div>
            <Badge
              variant={
                currentProject.status === "active"
                  ? "default"
                  : currentProject.status === "completed"
                    ? "outline"
                    : "secondary"
              }
              className={
                currentProject.status === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : currentProject.status === "completed"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-100"
              }
            >
              {currentProject.status === "active"
                ? "Ativo"
                : currentProject.status === "completed"
                  ? "Concluído"
                  : "Pausado"}
            </Badge>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progresso</span>
              <span>{currentProject.progress}%</span>
            </div>
            <Progress value={currentProject.progress} className="h-1.5" />
          </div>
        </div>
      )}

      <Tabs value={activeWorkspaceTab} onValueChange={setActiveWorkspaceTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="project" className="flex-1">
              Projeto
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              Módulos
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex-1">
              Integração
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="project" className="mt-0">
              {currentProject ? (
                <div className="space-y-4">
                  {showDetails ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{currentProject.name}</CardTitle>
                            <CardDescription>Cliente: {currentProject.client}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar projeto</DropdownMenuItem>
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Exportar relatório</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Arquivar projeto</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Collapsible defaultOpen={!isCompact}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                              <span>Equipe</span>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-2 mt-2">
                                {currentProject.team.map((member) => (
                                  <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                        <AvatarFallback>
                                          {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{member.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {member.role}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          <Separator />

                          <Collapsible defaultOpen={!isCompact}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                              <span>Módulos Ativos</span>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {currentProject.modules.map((moduleId) => {
                                  const module = moduleInfo[moduleId as keyof typeof moduleInfo]
                                  return module ? (
                                    <Badge key={moduleId} variant="outline" className="flex items-center gap-1">
                                      {module.icon}
                                      <span>{module.name}</span>
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                              <span>Modelos IA</span>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {currentProject.models.map((modelId) => {
                                  const model = modelInfo[modelId as keyof typeof modelInfo]
                                  return model ? (
                                    <Badge
                                      key={modelId}
                                      variant="outline"
                                      className="flex items-center gap-1 bg-amber-50"
                                    >
                                      {model.icon}
                                      <span>{model.name}</span>
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          <div className="text-xs text-gray-500 flex items-center justify-between">
                            <span>Última atualização:</span>
                            <span>{formatDate(currentProject.lastUpdated)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Ver Calendário
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Gerenciar Equipe
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{currentProject.name}</CardTitle>
                            <CardDescription>Cliente: {currentProject.client}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Equipe:</span>
                            <span className="text-sm">{currentProject.team.length} membros</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Módulos:</span>
                            <span className="text-sm">{currentProject.modules.length} ativos</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Modelos IA:</span>
                            <span className="text-sm">{currentProject.models.length} ativos</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalhes Completos
                        </Button>
                      </CardFooter>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Próximas Atividades</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <ChevronRight className="h-4 w-4 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Criar posts para campanha de fim de ano</p>
                              <p className="text-xs text-gray-500">Vencimento: 25/11/2023</p>
                            </div>
                          </li>
                          {showDetails && (
                            <>
                              <li className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">Revisar estratégia de hashtags</p>
                                  <p className="text-xs text-gray-500">Vencimento: 20/11/2023</p>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">Analisar métricas da última campanha</p>
                                  <p className="text-xs text-gray-500">Vencimento: 30/11/2023</p>
                                </div>
                              </li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                      {!showDetails && (
                        <CardFooter className="pt-0">
                          <Button variant="ghost" size="sm" className="text-xs w-full">
                            <Plus className="h-3 w-3 mr-1" />
                            Ver Mais Atividades
                          </Button>
                        </CardFooter>
                      )}
                    </Card>

                    {showDetails && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Resumo de Desempenho</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Engajamento</span>
                                <span>+12% esta semana</span>
                              </div>
                              <Progress value={72} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Alcance</span>
                                <span>+8% esta semana</span>
                              </div>
                              <Progress value={65} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Conversões</span>
                                <span>+5% esta semana</span>
                              </div>
                              <Progress value={48} className="h-1" />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" size="sm" className="text-xs w-full">
                            <BarChart className="h-3 w-3 mr-1" />
                            Ver Relatório Completo
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <FolderOpen className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum projeto selecionado</h3>
                  <p className="text-sm text-gray-500 mb-4">Selecione um projeto para ver seus detalhes</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Projeto
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {currentModule.icon}
                        <CardTitle className="text-base">{currentModule.name}</CardTitle>
                      </div>
                      <Badge>Módulo</Badge>
                    </div>
                    <CardDescription>{currentModule.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Collapsible defaultOpen={!isCompact}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                          <span>Métricas</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-2 mt-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Engajamento</span>
                                <span>{currentModule.metrics.engagement}%</span>
                              </div>
                              <Progress value={currentModule.metrics.engagement} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Alcance</span>
                                <span>{currentModule.metrics.reach}%</span>
                              </div>
                              <Progress value={currentModule.metrics.reach} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Conversão</span>
                                <span>{currentModule.metrics.conversion}%</span>
                              </div>
                              <Progress value={currentModule.metrics.conversion} className="h-1" />
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <Separator />

                      <Collapsible defaultOpen={!isCompact}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                          <span>Melhores Práticas</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="space-y-1 mt-2">
                            {currentModule.bestPractices.map((practice, index) => (
                              <li key={index} className="text-xs flex items-start">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500 shrink-0 mt-0.5" />
                                <span>{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {currentModel.icon}
                        <CardTitle className="text-base">{currentModel.name}</CardTitle>
                      </div>
                      <Badge variant="outline">Modelo IA</Badge>
                    </div>
                    <CardDescription>{currentModel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Collapsible defaultOpen={!isCompact}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                        <span>Capacidades</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="space-y-1 mt-2">
                          {currentModel.capabilities.map((capability, index) => (
                            <li key={index} className="text-xs flex items-start">
                              <Zap className="h-3 w-3 mr-1 text-amber-500 shrink-0 mt-0.5" />
                              <span>{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {integrationInfo.icon}
                        <CardTitle className="text-base">{integrationInfo.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{integrationInfo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          {currentModule.icon}
                          <h4 className="text-sm font-medium">Integração com Módulo</h4>
                        </div>
                        <p className="text-xs">{integrationInfo.moduleIntegration}</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full text-xs h-7">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Aplicar Módulo
                        </Button>
                      </div>

                      <div className="p-3 bg-amber-50 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          {currentModel.icon}
                          <h4 className="text-sm font-medium">Integração com Modelo IA</h4>
                        </div>
                        <p className="text-xs">{integrationInfo.modelIntegration}</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full text-xs h-7">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Aplicar Modelo
                        </Button>
                      </div>

                      {showDetails && (
                        <div className="p-3 bg-green-50 rounded-md">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-green-600" />
                            Sugestões de Conteúdo
                          </h4>
                          <ul className="space-y-1">
                            {currentModule.recommendedContent.map((content, index) => (
                              <li key={index} className="text-xs flex items-start">
                                <ArrowRight className="h-3 w-3 mr-1 text-green-600 shrink-0 mt-0.5" />
                                <span>{content}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
