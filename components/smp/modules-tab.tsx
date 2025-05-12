"use client"

import { useState, useEffect } from "react"
import { loadModules, saveUserPreference, type Module } from "@/lib/smp-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  Youtube,
  Mail,
  BarChart,
  Target,
  Users,
  FileText,
  MessageCircle,
  Settings,
  Calendar,
  ChevronRight,
  Zap,
  Filter,
  X,
  ChevronDown,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  video: Video,
  youtube: Youtube,
  mail: Mail,
  "bar-chart": BarChart,
  target: Target,
  users: Users,
  "file-text": FileText,
  "message-circle": MessageCircle,
  calendar: Calendar,
}

interface ModulesTabProps {
  selectedModule: string
  setSelectedModule: (module: string) => void
  onApplyToPost?: (moduleId: string) => void
  onApplyToTimeline?: (moduleId: string) => void
  onApplyToMindmap?: (moduleId: string) => void
}

export default function ModulesTab({
  selectedModule,
  setSelectedModule,
  onApplyToPost,
  onApplyToTimeline,
  onApplyToMindmap,
}: ModulesTabProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Carregar módulos
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const data = await loadModules()
        setModules(data)
        setFilteredModules(data)
      } catch (error) {
        console.error("Erro ao carregar módulos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  // Filtrar módulos quando a categoria ou busca mudar
  useEffect(() => {
    let filtered = modules

    // Filtrar por categoria
    if (activeCategory !== "all") {
      filtered = filtered.filter((module) => module.category === activeCategory)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (module) =>
          module.name.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query) ||
          module.features.some((feature: string) => feature.toLowerCase().includes(query)),
      )
    }

    setFilteredModules(filtered)
  }, [modules, activeCategory, searchQuery])

  // Obter categorias únicas
  const categories = ["all", ...Array.from(new Set(modules.map((module) => module.category)))]

  // Selecionar um módulo
  const handleSelectModule = async (moduleId: string) => {
    setSelectedModule(moduleId)
    setExpandedModule(moduleId === expandedModule ? null : moduleId)
    await saveUserPreference("current_user", "selected_module", moduleId)
  }

  // Renderizar ícone
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Settings
    return <IconComponent className="h-5 w-5 text-[#4b7bb5]" />
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-full animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Buscar módulos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          {searchQuery && (
            <Button variant="outline" size="icon" onClick={() => setSearchQuery("")} className="h-10 w-10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showFilters && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full flex overflow-x-auto pb-1 mb-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex-shrink-0 data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                >
                  {category === "all" ? "Todos" : category === "social" ? "Redes Sociais" : "Planejamento"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredModules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum módulo encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all hover:border-[#4b7bb5] ${
                    selectedModule === module.id ? "border-[#4b7bb5] bg-blue-50" : ""
                  } ${module.status !== "active" ? "opacity-70" : ""}`}
                  onClick={() => module.status === "active" && handleSelectModule(module.id)}
                >
                  <CardHeader className="pb-2 px-4 pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {renderIcon(module.icon)}
                        <CardTitle className="text-base font-semibold">{module.name}</CardTitle>
                      </div>
                      <Badge
                        variant={module.status === "active" ? "outline" : "secondary"}
                        className={module.status === "active" ? "bg-green-50 text-green-700" : ""}
                      >
                        {module.status === "active" ? "Ativo" : "Em breve"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs mt-1 line-clamp-2">{module.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2 px-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {module.features.slice(0, 2).map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-white text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {module.features.length > 2 && (
                        <Badge variant="outline" className="bg-white text-xs">
                          +{module.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 px-4 pb-4 flex justify-between items-center">
                    {selectedModule === module.id ? (
                      <Badge className="bg-[#4b7bb5]">
                        <Check className="h-3 w-3 mr-1" /> Selecionado
                      </Badge>
                    ) : (
                      module.status === "active" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Zap className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Aplicar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Selecionar este módulo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedModule(expandedModule === module.id ? null : module.id)
                      }}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expandedModule === module.id ? "rotate-180" : ""}`}
                      />
                      <span className="text-xs ml-1">Detalhes</span>
                    </Button>
                  </CardFooter>

                  {expandedModule === module.id && (
                    <div className="px-4 pb-4 pt-0 border-t">
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-2">
                          <span>Ações Rápidas</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {onApplyToPost && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onApplyToPost(module.id)
                                }}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Aplicar ao Post
                              </Button>
                            )}

                            {onApplyToTimeline && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onApplyToTimeline(module.id)
                                }}
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Aplicar à Timeline
                              </Button>
                            )}

                            {onApplyToMindmap && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onApplyToMindmap(module.id)
                                }}
                              >
                                <Target className="h-3 w-3 mr-1" />
                                Aplicar ao Mindmap
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configurar
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <Accordion type="single" collapsible className="w-full mt-2">
                        <AccordionItem value="features">
                          <AccordionTrigger className="text-xs py-2">Recursos</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {module.features.map((feature, i) => (
                                <li key={i} className="text-xs flex items-start">
                                  <ChevronRight className="h-3 w-3 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="metrics">
                          <AccordionTrigger className="text-xs py-2">Métricas</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Engajamento</span>
                                  <span className="text-[#4b7bb5] font-medium">{module.metrics.engagement}%</span>
                                </div>
                                <Progress value={module.metrics.engagement} className="h-1.5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Alcance</span>
                                  <span className="text-[#4b7bb5] font-medium">{module.metrics.reach}%</span>
                                </div>
                                <Progress value={module.metrics.reach} className="h-1.5" />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
